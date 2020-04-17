import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ServiceWorkerModule } from '@angular/service-worker';
import { AngularFireModule } from '@angular/fire';

import { BranchesFeatureModule } from '@idc/branches/feature';

import { AppComponent } from './app.component';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [AppComponent],
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
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production
    }),
    BranchesFeatureModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
