import { NgModule } from '@angular/core';
import { AsyncPipe, NgClass, NgFor, NgIf, NgStyle } from '@angular/common';

import { BookingTempRoutingModule } from './router/router.module';
import { TemplatePreviewModalComponent } from './components/template-preview-modal/template-preview-modal.component';
import {
  ButtonModule,
  DsFormsModule,
  DsSpinnerModule,
  DsToggleswitchModule,
  IconModule,
  MessageModule,
  ModalModule,
  PaginationModule,
} from '@ds24/elements';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { CalendarScreenModule } from '../calendar/calendar.module';
import { NgLetModule } from 'ng-let';
import { BookingTemplateComponent } from './components/booking-template/booking-template.component';
import { BookingTemplateModalComponent } from './components/booking-template-modal/booking-template-modal.component';

@NgModule({
  declarations: [BookingTemplateComponent, BookingTemplateModalComponent, TemplatePreviewModalComponent],
  imports: [
    BookingTempRoutingModule,
    IconModule,
    PipesModule,
    AsyncPipe,
    DsSpinnerModule,
    MessageModule,
    MatTooltipModule,
    PaginationModule,
    DsFormsModule,
    ReactiveFormsModule,
    ModalModule,
    MatDialogModule,
    DsToggleswitchModule,
    TranslateModule,
    CalendarScreenModule,
    NgStyle,
    NgFor,
    NgIf,
    NgClass,
    NgLetModule,
    ButtonModule,
  ],
  exports: [BookingTemplateComponent, BookingTemplateModalComponent, TemplatePreviewModalComponent],
})
export class BookingTempModule {}
