import { NgModule } from '@angular/core';
import { CustomTabsComponent } from './custom-tabs.component';
import { NgClass, NgFor } from '@angular/common';

@NgModule({
  imports: [NgClass, NgFor],
  declarations: [CustomTabsComponent],
  exports: [CustomTabsComponent],
})
export class CustomTabsModule {}
