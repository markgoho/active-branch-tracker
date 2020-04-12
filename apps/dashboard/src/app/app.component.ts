import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

export interface BranchInfo {
  repositoryName: string;
  organizationName: string;
  branchName: string;
  head_commit?: {
    id: string;
    committer: {
      name: string;
      email: string;
    };
    author: {
      name: string;
      email: string;
    };
    timestamp: string;
    tree_id: string;
    message: string;
  };
  head_sha?: string;
  created_at?: string;
  updated_at?: string;
  checkSuiteStatus?: CheckSuiteConclusion;
  defaultBranch: boolean;
}

export enum CheckSuiteConclusion {
  Success = 'success',
  Failure = 'failure',
  Neutral = 'neutral',
  Cancelled = 'cancelled',
  TimedOut = 'timed_out',
  ActionRequired = 'action_required',
  Stale = 'stale'
}

interface BranchInfoVM {
  defaultBranches: BranchInfo[];
  otherBranches: BranchInfo[];
}

@Component({
  selector: 'idc-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  CheckSuiteConclusion = CheckSuiteConclusion;
  branchInfo$: Observable<BranchInfoVM>;

  constructor(private afs: AngularFirestore) {}

  ngOnInit(): void {
    this.branchInfo$ = this.afs
      .collection<BranchInfo>('branches')
      .snapshotChanges()
      .pipe(
        map(docChange => docChange.map(change => change.payload.doc.data())),
        tap(branchInfo => {
          for (const branch of branchInfo) {
            if (branch.checkSuiteStatus === CheckSuiteConclusion.Failure) {
              console.log('FAILURE!');
            }
          }
        }),
        map(branchInfo => {
          const defaultBranches = branchInfo.filter(
            branch => branch.defaultBranch === true
          );
          const otherBranches = branchInfo.filter(
            branch => branch.defaultBranch === false
          );

          return {
            defaultBranches,
            otherBranches
          };
        })
      );
  }
}
