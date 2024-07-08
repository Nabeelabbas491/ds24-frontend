import { NgModule } from '@angular/core';
import { AsyncPipe, NgClass, NgFor, NgIf, UpperCasePipe, TitleCasePipe, DatePipe, NgStyle } from '@angular/common';
import { VendorManagementComponent } from './components/vendor-management/vendor-management.component';
import { AppointmentListComponent } from './components/appointment-list/appointment-list.component';
import { SettingsComponent } from './components/settings/settings.component';
import { AppointmentCalendarComponent } from './components/appointment-calendar/appointment-calendar.component';
import { VendorRoutingModule } from './router/router.module';
import {
  DsSelectModule,
  DsToggleswitchModule,
  IconModule,
  DsSpinnerModule,
  DsSnackbarModule,
  ColorPickerModule,
  MessageModule,
  DsBadgeModule,
} from '@ds24/elements';
import { PaginationModule } from '@ds24/elements';
import { ButtonModule } from '@ds24/elements';
import { ModalModule, DropdownModule } from '@ds24/elements';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';

import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';

import { TranslateModule } from '@ngx-translate/core';
import { AppointmentDetailsComponent } from './components/appointment-details/appointment-details.component';
import { BreadcrumbModule, DsFormsModule } from '@ds24/elements';
import { ReactiveFormsModule } from '@angular/forms';
import { AppointmentTabComponent } from './components/appointment-tab/appointment-tab.component';
import { NgLetModule } from 'ng-let';
import { ManageScheduleComponent } from './components/manage-schedule/manage-schedule.component';
import { TimeZoneSelectComponent } from './components/time-zone-select/time-zone-select.component';
import { DayRowComponent } from './components/day-row/day-row.component';
import { TimeRangeComponent } from './components/time-range/time-range.component';
import { ScheduleFormServiceModule } from 'src/app/services/schedule-form.service.module';
import { LogoUploadComponent } from './components/logo-upload/logo-upload.component';
import { PreviewComponent } from './components/preview/preview.component';
import { BookingTypeComponent } from './components/booking-type/booking-type.component';
import { AddDateOverrideComponent } from './components/add-date-override/add-date-override.component';
import { CalendarScreenModule } from '../calendar/calendar.module';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { CancelledBadgeComponent } from './components/cancelled-badge/cancelled-badge.component';
import { CustomTabsModule } from '../../shared/components/custom-tabs/custom-tabs.module';
import { BookingTempModule } from '../booking-template/booking-template.module';

@NgModule({
  declarations: [
    VendorManagementComponent,
    AppointmentListComponent,
    SettingsComponent,
    AppointmentCalendarComponent,
    AppointmentDetailsComponent,
    AppointmentTabComponent,
    ManageScheduleComponent,
    TimeZoneSelectComponent,
    DayRowComponent,
    TimeRangeComponent,
    LogoUploadComponent,
    PreviewComponent,
    BookingTypeComponent,
    AddDateOverrideComponent,
    CancelledBadgeComponent,
  ],
  imports: [
    AsyncPipe,
    NgStyle,
    NgFor,
    NgIf,
    NgClass,
    UpperCasePipe,
    TitleCasePipe,
    DatePipe,
    VendorRoutingModule,
    PaginationModule,
    ButtonModule,
    MatSortModule,
    TranslateModule,
    BreadcrumbModule,
    DsFormsModule,
    ReactiveFormsModule,
    ModalModule,
    MatDialogModule,
    IconModule,
    MatDialogModule,
    IconModule,
    DropdownModule,
    NgLetModule,
    DsSelectModule,
    DsToggleswitchModule,
    DsSpinnerModule,
    DsSnackbarModule,
    ScheduleFormServiceModule,
    CalendarScreenModule,
    ColorPickerModule,
    BreadcrumbModule,
    MatMenuModule,
    PipesModule,
    DsBadgeModule,
    MessageModule,
    MatTooltipModule,
    CustomTabsModule,
    BookingTempModule,
  ],
})
export class VendorModule {}
