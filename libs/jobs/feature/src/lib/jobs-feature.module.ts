import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { JobsComponent } from './jobs/jobs.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: JobsComponent }]),
  ],
  declarations: [JobsComponent],
})
export class JobsFeatureModule {}
