import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Tab } from '../../../types/tab.type';

@Component({
  selector: 'ds-custom-tabs',
  templateUrl: './custom-tabs.component.html',
})
export class CustomTabsComponent {
  @Output() tabSelected = new EventEmitter<Tab>();
  @Input() items: Tab[] = [];

  selectTab(tab: Tab) {
    this.tabSelected.emit(tab);
  }
}
