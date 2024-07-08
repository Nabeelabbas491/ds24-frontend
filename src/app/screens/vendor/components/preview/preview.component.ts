import { Component, Input } from '@angular/core';
@Component({
  selector: 'ds-preview',
  templateUrl: './preview.component.html',
})
export class PreviewComponent {
  @Input()
  primaryColor: string = '';

  @Input()
  secondaryColor: string = '';

  constructor() {}
}
