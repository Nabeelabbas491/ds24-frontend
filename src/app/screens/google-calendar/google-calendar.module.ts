import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ButtonModule, DsSpinnerModule, MessageModule, IconModule } from '@ds24/elements';
import { TranslateModule } from '@ngx-translate/core';
import { LoaderComponent } from './components/loader.component';
import { AsyncPipe, NgIf } from '@angular/common';
import { NgLetModule } from 'ng-let';
import { GooglePopupMessageComponent } from './components/google-popup-message/google-popup-message.component';

export const COMPONENTS = [LoaderComponent, GooglePopupMessageComponent];

const routes: Routes = [
  { path: '', component: LoaderComponent },
  { path: 'google-popup', component: GooglePopupMessageComponent },
];

@NgModule({
  imports: [
    ButtonModule,
    IconModule,
    MessageModule,
    TranslateModule.forChild(),
    AsyncPipe,
    NgLetModule,
    NgIf,
    RouterModule.forChild(routes),
    DsSpinnerModule,
  ],
  declarations: COMPONENTS,
})
export class GoogleCalendarModule {}
