import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { IconName, IconColor } from '@ds24/elements';
import { Store } from '@ngrx/store';
import * as actions from '../../../../store/actions';
import * as selectors from '../../../../store/selectors';
import { takeUntil } from 'rxjs';
import { ReactiveLifecycles } from '@ds24/utilities';
@Component({
  selector: 'ds-logo-upload',
  templateUrl: './logo-upload.component.html',
})
export class LogoUploadComponent extends ReactiveLifecycles {
  spinnerColor = IconColor.Primary300;

  icons: typeof IconName = IconName;
  iconColors: typeof IconColor = IconColor;
  selectedlogo: string | SafeUrl | any = '';

  @Input()
  logoUrl: string | null | undefined;

  @Output()
  logoChanged: EventEmitter<File | undefined> = new EventEmitter<File | undefined>();

  selectRemoveVendorLogoPending$ = this.store.select(selectors.vendorSettings.selectRemoveVendorLogoPending);
  selectRemoveVendorLogoSuccess$ = this.store.select(selectors.vendorSettings.selectRemoveVendorLogoSuccess);

  constructor(
    private sanitizer: DomSanitizer,
    private store: Store,
  ) {
    super();

    this.selectRemoveVendorLogoSuccess$.pipe(takeUntil(this.ngOnDestroy$)).subscribe(() => {
      this.selectedlogo = '';
      this.logoUrl = '';
      this.logoChanged.emit(undefined);
    });
  }

  selectFile(event: any) {
    this.logoUrl = '';
    this.selectedlogo = this.createSafeUrl(event.target.files[0]);
    // converting image in to base 64 Url
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      this.logoChanged.emit(file);
    }
  }

  createSafeUrl(file: File) {
    return this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(file));
  }

  removeLogo() {
    this.store.dispatch(actions.vendorSettings.removeVendorLogo());
  }
}
