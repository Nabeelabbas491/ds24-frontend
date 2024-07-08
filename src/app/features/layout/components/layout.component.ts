import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ds-layout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './layout.component.html',
})
export class LayoutComponent {}
