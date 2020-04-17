import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { map, tap, distinctUntilChanged } from 'rxjs/operators';
import { ServiceWorkerUpdateService } from './service-worker-update.service';

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
  tracked: boolean;
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
  trackedBranches: BranchInfo[];
}

export interface DisplayConfig {
  trackedBranches: 'expanded' | 'collapsed';
  otherBranches: 'expanded' | 'collapsed';
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
    localStorage.getItem('config')
  );

  // time$: Observable<Date> = timer(0, 60000).pipe(
  //   map(tick => new Date()),
  //   shareReplay(1)
  // );

  config$: Observable<DisplayConfig> = this.config.asObservable().pipe(
    distinctUntilChanged(),
    map(config => JSON.parse(config))
  );

  scream = new Audio('/assets/willhelm.wav');

  constructor(
    private afs: AngularFirestore,
    private swUpdate: ServiceWorkerUpdateService
  ) {}

  ngOnInit(): void {
    if (localStorage.getItem('config') === null) {
      const config: DisplayConfig = {
        trackedBranches: 'expanded',
        otherBranches: 'expanded'
      };

      const configString = JSON.stringify(config);
      localStorage.setItem('config', configString);
      this.config.next(configString);
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
        }),
        map(docChange => docChange.map(change => change.payload.doc.data())),
        map(branchInfo => {
          const defaultBranches = branchInfo
            .filter(branch => branch.defaultBranch === true)
            .sort(sortByTime);
          const otherBranches = branchInfo
            .filter(
              branch =>
                branch.defaultBranch === false && branch.tracked === false
            )
            .sort(sortByTime);

          const trackedBranches = branchInfo
            .filter(branch => branch.tracked === true)
            .sort(sortByTime);

          return {
            defaultBranches,
            otherBranches,
            trackedBranches
          };
        })
      );

    this.activeBranchesVm$ = combineLatest([
      this.branchInfo$,
      this.config$
    ]).pipe(
      map(([branchInfo, config]: [BranchInfoVM, DisplayConfig]) => {
        return {
          ...branchInfo,
          config
        };
      })
    );
  }

  setConfig(config: Partial<DisplayConfig>): void {
    const currentConfig = JSON.parse(
      localStorage.getItem('config')
    ) as DisplayConfig;

    const newConfig = JSON.stringify({
      ...currentConfig,
      ...config
    });

    localStorage.setItem('config', newConfig);
    this.config.next(newConfig);
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

function sortByTime(branchA: BranchInfo, branchB: BranchInfo): number {
  const { updated_at: updatedA, created_at: createdA } = branchA;
  const { updated_at: updatedB, created_at: createdB } = branchB;

  return new Date(updatedA || createdA).getTime() >
    new Date(updatedB || createdB).getTime()
    ? -1
    : 1;
}
