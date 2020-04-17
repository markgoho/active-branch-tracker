import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

import { BranchInfo, CheckSuiteConclusion } from '@idc/branches/data-access';

@Component({
  selector: 'idc-branch-container',
  templateUrl: './branch-container.component.html',
  styleUrls: ['./branch-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BranchContainerComponent {
  CheckSuiteConclusion = CheckSuiteConclusion;

  @Input() branch: BranchInfo;
  @Input() viewType: 'expanded' | 'collapsed' = 'expanded';

  @Output() trackBranch = new EventEmitter<BranchInfo>();
  @Output() untrackBranch = new EventEmitter<BranchInfo>();

  getBranchLink(): string {
    const {
      repositoryName,
      organizationName,
      branchName: head_branch,
      defaultBranch
    } = this.branch;

    const needsTree = defaultBranch ? `` : `tree/`;

    return `//github.com/${organizationName}/${repositoryName}/${needsTree}${head_branch}`;
  }

  getCommitLink(): string {
    const { repositoryName, organizationName, head_sha } = this.branch;

    return `//github.com/${organizationName}/${repositoryName}/commit/${head_sha}`;
  }

  getFailurePercentage(): number {
    const { checkSuiteRuns, checkSuiteFailures } = this.branch;

    return Math.round(
      ((checkSuiteRuns - checkSuiteFailures) / checkSuiteRuns) * 100
    );
  }
}
