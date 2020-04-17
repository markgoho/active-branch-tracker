import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BranchesUiComponentsModule } from '@idc/branches/ui-components';
import { ActiveBranchesComponent } from './active-branches/active-branches.component';

@NgModule({
  imports: [CommonModule, BranchesUiComponentsModule],
  declarations: [ActiveBranchesComponent],
  exports: [ActiveBranchesComponent]
})
export class BranchesFeatureModule {}
