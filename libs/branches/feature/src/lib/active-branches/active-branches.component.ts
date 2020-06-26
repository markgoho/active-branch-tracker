import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  BranchInfo,
  BranchListService,
  CheckSuiteConclusion,
} from '@idc/branches/data-access';
import {
  DisplayConfigService,
  DisplayConfig,
  DisplayType,
} from '@idc/display-config';

import { BranchInfoVM } from '../branchInfoVM';

@Component({
  selector: 'idc-active-branches',
  templateUrl: './active-branches.component.html',
  styleUrls: ['./active-branches.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActiveBranchesComponent implements OnInit {
  CheckSuiteConclusion = CheckSuiteConclusion;
  DisplayType = DisplayType;
  branchInfo$: Observable<BranchInfoVM>;
  activeBranchesVm$: Observable<any>;

  // time$: Observable<Date> = timer(0, 60000).pipe(
  //   map(tick => new Date()),
  //   shareReplay(1)
  // );

  constructor(
    public branchListService: BranchListService,
    public configService: DisplayConfigService
  ) {}

  ngOnInit(): void {
    this.branchInfo$ = this.branchListService.branchInfo$.pipe(
      map(branchInfo => {
        console.log(branchInfo.length);

        const defaultBranches = branchInfo
          .filter(branch => branch.defaultBranch === true)
          .sort(sortByTime);

        const otherBranches = branchInfo
          .filter(
            branch => branch.defaultBranch === false && branch.tracked === false
          )
          .sort(sortByTime);

        const trackedBranches = branchInfo
          .filter(branch => branch.tracked === true)
          .sort(sortByTime);

        console.log(
          otherBranches.filter(branch => branch.organizationName === 'ideacrew')
        );

        return {
          defaultBranches,
          otherBranches,
          trackedBranches,
        };
      })
    );

    this.activeBranchesVm$ = combineLatest([
      this.branchInfo$,
      this.configService.config$,
    ]).pipe(
      map(([branchInfo, config]: [BranchInfoVM, DisplayConfig]) => {
        return {
          ...branchInfo,
          config,
        };
      })
    );
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
