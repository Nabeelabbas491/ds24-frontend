import { Component, Input } from '@angular/core';

@Component({
  selector: 'ds-cancelled-badge',
  templateUrl: './cancelled-badge.component.html',
})
export class CancelledBadgeComponent {
  @Input() elementStatus: string = '';
}
