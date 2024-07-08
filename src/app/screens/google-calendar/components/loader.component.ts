import { Component, ChangeDetectionStrategy } from '@angular/core';
import { IconColor } from '@ds24/elements';
import { Store } from '@ngrx/store';
import { actions } from './../../../store';
import { ActivatedRoute } from '@angular/router';
import { getIntegrationInfo } from './../../../shared/common/util';
import { GoogleIntegrationInfo } from './../../../types/google-integration.type';

@Component({
  selector: 'ds-loader',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './loader.component.html',
})
export class LoaderComponent {
  spinnerColor = IconColor.Neutral500;

  constructor(
    private store: Store,
    private activatedRoute: ActivatedRoute,
  ) {}
  ngOnInit() {
    const code: string | null = this.activatedRoute.snapshot.queryParamMap.get('code');
    const googleIntegrationInfo: GoogleIntegrationInfo | null = getIntegrationInfo();

    if (code && googleIntegrationInfo) {
      if (googleIntegrationInfo.integrationMode === 'client-booking') {
        this.store.dispatch(
          actions.googleIntegration.syncAppointmentClient({
            bookingProductId: googleIntegrationInfo.bookingProductId!,
            code,
          }),
        );
      }

      if (googleIntegrationInfo.integrationMode === 'vendor-appointment') {
        this.store.dispatch(
          actions.googleIntegration.googleConnect({
            code,
          }),
        );
      }
    }
  }
}
