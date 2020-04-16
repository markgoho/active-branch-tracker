import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';

import { AppComponent } from './app.component';
import { BranchContainerComponent } from './branch-container/branch-container.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [AppComponent, BranchContainerComponent],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp({
      apiKey: 'AIzaSyDsNXuItZFPCzfTSjcEKDvXy2xA4sd-Tgs',
      authDomain: 'active-branches-report.firebaseapp.com',
      databaseURL: 'https://active-branches-report.firebaseio.com',
      projectId: 'active-branches-report',
      storageBucket: 'active-branches-report.appspot.com',
      messagingSenderId: '633810997367',
      appId: '1:633810997367:web:931c5bc156a5e71d097672',
      measurementId: 'G-WV4T2RGHM3'
    }),
    AngularFirestoreModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
