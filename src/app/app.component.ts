import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ds-app',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.component.html',
})
export class AppComponent {
  constructor() {}
}
