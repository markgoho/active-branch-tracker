import { BranchInfo } from '@idc/branches/data-access';

export interface BranchInfoVM {
  defaultBranches: BranchInfo[];
  otherBranches: BranchInfo[];
  trackedBranches: BranchInfo[];
}
