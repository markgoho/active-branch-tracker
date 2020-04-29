import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { JobsService, FullInfo } from '@idc/jobs/data-access';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JobsComponent implements OnInit {
  jobs: Observable<FullInfo[]>;

  constructor(private jobsService: JobsService) {}
  ngOnInit(): void {
    this.jobs = this.jobsService.repos.pipe(
      tap((jobs) =>
        jobs.forEach((job) => {
          console.log('Repo:', job.repoName);

          for (const prop in job.jobs) {
            if (job.jobs.hasOwnProperty(prop)) {
              console.log(prop, job.jobs[prop]);
            }
          }
        })
      )
    );
  }

  msToTime(duration: number): string {
    const seconds = Math.floor((duration / 1000) % 60);
    const minutes = Math.floor((duration / (1000 * 60)) % 60);

    return `${minutes}m ${seconds}s`;
  }
}
