import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { AngularFirestore, DocumentChangeType } from '@angular/fire/firestore';
import { Observable, of, BehaviorSubject, combineLatest, timer } from 'rxjs';
import {
  map,
  tap,
  distinctUntilChanged,
  debounceTime,
  shareReplay
} from 'rxjs/operators';

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
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  CheckSuiteConclusion = CheckSuiteConclusion;
  branchInfo$: Observable<BranchInfoVM>;
  activeBranchesVm$: Observable<any>;

  config: BehaviorSubject<string> = new BehaviorSubject<string>(
    localStorage.getItem('viewType')
  );

  // time$: Observable<Date> = timer(0, 60000).pipe(
  //   map(tick => new Date()),
  //   shareReplay(1)
  // );

  config$: Observable<string> = this.config
    .asObservable()
    .pipe(distinctUntilChanged());

  scream = new Audio('/assets/willhelm.wav');

  constructor(private afs: AngularFirestore) {}

  ngOnInit(): void {
    if (localStorage.getItem('viewType') === null) {
      localStorage.setItem('viewType', 'expanded');
      this.config.next('expanded');
    }

    this.branchInfo$ = this.afs
      .collection<BranchInfo>('branches')
      .snapshotChanges()
      .pipe(
        tap(async docChange => {
          const modified = docChange.filter(
            change => change.type === 'modified'
          );
          let newFailure = false;

          for (const branch of modified) {
            const { checkSuiteStatus } = branch.payload.doc.data();
            if (checkSuiteStatus === CheckSuiteConclusion.Failure) {
              newFailure = true;
              console.log({ newFailure: branch });
            }
          }

          if (newFailure === true) {
            try {
              await this.scream.play();
            } catch (e) {}
          }
        }),
        map(docChange => docChange.map(change => change.payload.doc.data())),
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

    this.activeBranchesVm$ = combineLatest([
      this.branchInfo$,
      this.config$
    ]).pipe(
      map(([branchInfo, viewType]: [BranchInfoVM, string]) => {
        return {
          ...branchInfo,
          viewType
        };
      })
    );
  }

  setConfig(viewType: string): void {
    localStorage.setItem('viewType', viewType);
    this.config.next(viewType);
  }
}

function sortByTime(branchA: BranchInfo, branchB: BranchInfo): number {
  const { updated_at: updatedA, created_at: createdA } = branchA;
  const { updated_at: updatedB, created_at: createdB } = branchB;

  return new Date(updatedA || createdA).getTime() >
    new Date(updatedB || createdB).getTime()
    ? -1
    : 1;
}
