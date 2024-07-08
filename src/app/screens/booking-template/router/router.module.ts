import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookingTemplateComponent } from '../components/booking-template/booking-template.component';

const routes: Routes = [
  {
    path: '',
    component: BookingTemplateComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BookingTempRoutingModule {}
