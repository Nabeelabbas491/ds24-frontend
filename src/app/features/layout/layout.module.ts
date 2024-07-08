import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LayoutComponent } from './components/layout.component';

@NgModule({
  imports: [RouterModule],
  declarations: [LayoutComponent],
  exports: [LayoutComponent],
})
export class LayoutFeatureModule {}
