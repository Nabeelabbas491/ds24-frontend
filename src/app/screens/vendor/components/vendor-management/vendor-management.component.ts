import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { actions, selectors } from '../../../../store';
import { Tab } from '../../../../types/tab.type';
@Component({
  selector: 'ds-vendor-management',
  templateUrl: './vendor-management.component.html',
})
export class VendorManagementComponent {
  items: Tab[] = [];
  constructor(private _store: Store) {
    this._store.select(selectors.vendor.selectTabItems).subscribe(data => {
      this.items = data;
    });
  }

  navigateToParticularPage(tabInfo: Tab) {
    this._store.dispatch(actions.vendor.routeChangeOnTabChange({ tabInfo }));
  }
}
