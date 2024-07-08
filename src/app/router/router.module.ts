import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { accessTokenResolver } from './access-token-resolver';

export const routes: Routes = [
  { path: '', redirectTo: '/vendor', pathMatch: 'full' },
  {
    path: 'booking-template-module',
    loadChildren: () => import('./../screens/booking-template/booking-template.module').then(m => m.BookingTempModule),
    resolve: [accessTokenResolver],
  },
  {
    path: 'vendor',
    loadChildren: () => import('../screens/vendor/vendor.module').then(m => m.VendorModule),
    resolve: [accessTokenResolver],
  },
  {
    path: 'calendar',
    loadChildren: () => import('../screens/calendar/calendar.module').then(m => m.CalendarScreenModule),
  },
  {
    path: 'google-calendar',
    data: { title: 'Google Calendar' },
    loadChildren: () => import('../screens/google-calendar/google-calendar.module').then(m => m.GoogleCalendarModule),
  },
  {
    path: '**',
    loadChildren: () => import('../screens/not-found/not-found.module').then(m => m.NotFoundScreenModule),
    resolve: [accessTokenResolver],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRouterModule {}
