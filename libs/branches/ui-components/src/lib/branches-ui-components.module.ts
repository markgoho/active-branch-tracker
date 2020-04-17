import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BranchContainerComponent } from './branch-container/branch-container.component';

@NgModule({
  imports: [CommonModule],
  declarations: [BranchContainerComponent],
  exports: [BranchContainerComponent]
})
export class BranchesUiComponentsModule {}
