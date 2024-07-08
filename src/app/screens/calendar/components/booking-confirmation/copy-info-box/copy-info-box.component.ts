import { Component, Input } from '@angular/core';
import { IconColor, IconName } from '@ds24/elements';

@Component({
  selector: 'ds-copy-info-box',
  templateUrl: './copy-info-box.component.html',
})
export class CopyInfoBoxComponent {
  icons: typeof IconName = IconName;
  iconColors: typeof IconColor = IconColor;

  @Input()
  copyText: string | undefined = '';

  copyContent() {
    //to be implemented
  }
}
