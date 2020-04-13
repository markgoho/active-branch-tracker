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
  checkSuiteRuns: number;
  checkSuiteFailures: number;
  createdBy?: string;
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

  scream = new Audio('/assets/willhelm.wav');

  constructor(private afs: AngularFirestore) {}

  ngOnInit(): void {
    this.branchInfo$ = this.afs
      .collection<BranchInfo>('branches')
      .snapshotChanges()
      .pipe(
        map(docChange => docChange.map(change => change.payload.doc.data())),
        tap(async branchInfo => {
          let anyFailures = false;
          for (const branch of branchInfo) {
            if (branch.checkSuiteStatus === CheckSuiteConclusion.Failure) {
              anyFailures = true;
            }
          }
          if (anyFailures === true) {
            try {
              await this.scream.play();
            } catch (e) {}
          }
        }),
        map(branchInfo => {
          const defaultBranches = branchInfo
            .filter(branch => branch.defaultBranch === true)
            .sort(sortByTime);
          const otherBranches = branchInfo
            .filter(branch => branch.defaultBranch === false)
            .sort(sortByTime);

          return {
            defaultBranches,
            otherBranches
          };
        })
      );
  }
}

function sortByTime(branchA: BranchInfo, branchB: BranchInfo): number {
  const { updated_at: updatedA } = branchA;
  const { updated_at: updatedB } = branchB;

  return new Date(updatedA).getTime() > new Date(updatedB).getTime() ? -1 : 1;
}
