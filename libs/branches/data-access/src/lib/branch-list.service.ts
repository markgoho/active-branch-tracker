import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  DocumentChangeAction
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { BranchInfo } from './branchInfo';
import { CheckSuiteConclusion } from './checkSuiteConclusion';

@Injectable({
  providedIn: 'root'
})
export class BranchListService {
  private rawBranchData$: Observable<DocumentChangeAction<BranchInfo>[]>;
  branchInfo$: Observable<BranchInfo[]>;

  scream = new Audio('/assets/willhelm.wav');

  constructor(private afs: AngularFirestore) {
    this.rawBranchData$ = this.afs
      .collection<BranchInfo>('branches')
      .snapshotChanges()
      .pipe(
        tap(async docChange => {
          const modified = docChange.filter(
            change => change.type === 'modified'
          );
          let newFailure = false;

          for (const branch of modified) {
            const { checkSuiteStatus, tracked } = branch.payload.doc.data();
            if (
              checkSuiteStatus === CheckSuiteConclusion.Failure &&
              tracked === true
            ) {
              newFailure = true;
              console.log({ newFailure: branch.payload.doc.data() });
            }
          }

          if (newFailure === true) {
            try {
              await this.scream.play();
            } catch (e) {}
          }
        })
      );

    this.branchInfo$ = this.rawBranchData$.pipe(
      map(docChange => docChange.map(change => change.payload.doc.data()))
    );
  }

  async trackBranch(branch: BranchInfo): Promise<void> {
    const { organizationName, repositoryName, branchName } = branch;

    const branchRef = this.afs
      .collection<BranchInfo>('branches')
      .doc<BranchInfo>(`${organizationName}-${repositoryName}-${branchName}`);

    await branchRef.update({ tracked: true });
  }

  async untrackBranch(branch: BranchInfo): Promise<void> {
    const { organizationName, repositoryName, branchName } = branch;

    const branchRef = this.afs
      .collection<BranchInfo>('branches')
      .doc<BranchInfo>(`${organizationName}-${repositoryName}-${branchName}`);

    await branchRef.update({ tracked: false });
  }
}
