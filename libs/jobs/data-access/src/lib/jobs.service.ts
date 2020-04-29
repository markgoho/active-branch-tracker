import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { FullInfo, JobInformation } from './jobInfo';

@Injectable({
  providedIn: 'root',
})
export class JobsService {
  repos: Observable<FullInfo[]>;

  constructor(private afs: AngularFirestore) {
    this.repos = this.afs
      .collection<JobInformation>('check_runs')
      .snapshotChanges()
      .pipe(
        map((actions) => {
          const allRepoInfo: FullInfo[] = actions.map((a) => {
            const data: JobInformation = a.payload.doc.data();
            const repoName: string = a.payload.doc.id;

            const repoInfo: FullInfo = { repoName, jobs: data };

            return repoInfo;
          });

          return allRepoInfo;
        })
      );
  }
}
