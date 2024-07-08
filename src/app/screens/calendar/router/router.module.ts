import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalendarPageComponent } from '../components/calendar-page.component';
import { bookingTemplateResolver } from './booking-template.resolver';

export const routes: Routes = [
  {
    path: ':pid',
    component: CalendarPageComponent,
    data: { title: 'Calendar', page: 'calendar' },
    resolve: { bookingTemplateResolver },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CalendarRoutingModule {}
