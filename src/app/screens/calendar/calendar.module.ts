import { AsyncPipe, DatePipe, NgClass, NgFor, NgIf, NgSwitch, NgSwitchCase, NgTemplateOutlet } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  ButtonModule,
  DropdownModule,
  DsChipsModule,
  DsFormsModule,
  DsSnackbarModule,
  DsSpinnerModule,
  IconModule,
  LoaderModule,
  MessageModule,
} from '@ds24/elements';
import { TranslateModule } from '@ngx-translate/core';

import { PipesModule } from '../../shared/pipes/pipes.module';
import { CalendarRoutingModule } from './router/router.module';
import { CalendarPageComponent } from './components/calendar-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarComponent } from './../../shared/components/calendar/calendar/calendar.component';
import { CalendarCellComponent } from '../../shared/components/calendar/calendar/calendar-cell/calendar-cell.component';
import { BookingTypeSelectionComponent } from './components/booking-type-selection/booking-type-selection.component';
import { TimeSelectionComponent } from './components/time-selection/time-selection.component';
import { BookingSummaryComponent } from './components/booking-summary/booking-summary.component';
import { BookingFormComponent } from './components/booking-form/booking-form.component';
import { BookingConfirmationComponent } from './components/booking-confirmation/booking-confirmation.component';
import { CopyInfoBoxComponent } from './components/booking-confirmation/copy-info-box/copy-info-box.component';
import { BookingInfoComponent } from './components/booking-summary/booking-info/booking-info.component';
import { BookingUserProfileComponent } from './components/booking-user-profile/booking-user-profile.component';
import { BookingServiceModule } from './../../services/booking-service.module';
import { BookingSelectionStepComponent } from './components/booking-selection-step/booking-selection-step.component';
import { BookingSummaryStepComponent } from './components/booking-summary-step/booking-summary-step.component';
import { BookingConfirmationStepComponent } from './components/booking-confirmation-step/booking-confirmation-step.component';
import { DateTimeSelectionStepComponent } from './components/date-time-selection-step/date-time-selection-step.component';
import { BookingTypeSelectionStepComponent } from './components/booking-type-selection-step/booking-type-selection-step.component';

export const COMPONENTS = [
  BookingSelectionStepComponent,
  BookingSummaryStepComponent,
  BookingConfirmationStepComponent,
  BookingUserProfileComponent,
  CalendarPageComponent,
  BookingTypeSelectionComponent,
  TimeSelectionComponent,
  CalendarComponent,
  CalendarCellComponent,
  BookingSummaryComponent,
  BookingInfoComponent,
  BookingConfirmationComponent,
  CopyInfoBoxComponent,
  BookingFormComponent,
  DateTimeSelectionStepComponent,
  BookingTypeSelectionStepComponent,
];

@NgModule({
  imports: [
    NgSwitch,
    NgSwitchCase,
    AsyncPipe,
    DatePipe,
    NgFor,
    NgIf,
    NgClass,
    NgTemplateOutlet,
    PipesModule,
    CalendarRoutingModule,
    IconModule,
    LoaderModule,
    FormsModule,
    ReactiveFormsModule,
    DsFormsModule,
    DropdownModule,
    DsChipsModule,
    DsSpinnerModule,
    DsSnackbarModule,
    MessageModule,
    ButtonModule,
    BookingServiceModule,
    TranslateModule.forChild(),
  ],
  declarations: COMPONENTS,
  exports: COMPONENTS,
})
export class CalendarScreenModule {}
