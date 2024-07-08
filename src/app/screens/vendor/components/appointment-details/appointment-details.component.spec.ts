import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Clipboard } from '@angular/cdk/clipboard';
import { AppointmentDetailsComponent } from './appointment-details.component';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateService } from '@ngx-translate/core';
import * as actions from '../../../../store/actions';
import { of } from 'rxjs';
import { TranslateMockPipe } from './../../../../shared/pipes/translate-mock.pipe';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { State } from '../../../../store/state';
import { GoogleIntegrationInfo } from 'src/app/types/google-integration.type';

describe('AppointmentDetailsComponent', () => {
  let fixture: ComponentFixture<AppointmentDetailsComponent>;
  let component: AppointmentDetailsComponent;
  let mockStore: MockStore<State>;

  const clipboardMock = {
    copy: jest.fn(),
  };

  const mockTranslateService = {
    get: jest.fn().mockImplementation(() => of('sample message')),
    instant: jest.fn().mockReturnValue('sample message'),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppointmentDetailsComponent, TranslateMockPipe],
      providers: [
        { provide: Clipboard, useValue: clipboardMock },
        provideMockStore(),
        { provide: TranslateService, useValue: mockTranslateService },
      ],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AppointmentDetailsComponent);
    component = fixture.componentInstance;
    mockStore = TestBed.inject(MockStore);
    jest.spyOn(mockStore, 'dispatch');
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should copy phone number to clipboard', () => {
    const phoneControl = component.form.get('phone');
    phoneControl?.setValue('+919099229921');
    component.copyPhone();
    expect(clipboardMock.copy).toHaveBeenCalledWith('+919099229921');
  });

  it('should copy Zoom link to clipboard', () => {
    const zoomLinkControl = component.form.get('zoomLink');
    zoomLinkControl?.setValue('https://meet.asdyuus6723291');
    component.copyLink();
    expect(clipboardMock.copy).toHaveBeenCalledWith('https://meet.asdyuus6723291');
  });

  it('should call the snackbar popup', () => {
    const snackBarMessage = 'sample message';
    component.toggleSnackBar();
    fixture.detectChanges();
    expect(mockStore.dispatch).toHaveBeenCalledWith(actions.notification.callSnackBarPopup({ snackBarMessage }));
  });

  it('should call the translate service', () => {
    component.toggleSnackBar();
    fixture.detectChanges();
    expect(mockTranslateService.instant).toHaveBeenCalledWith('VENDOR.DETAILS.COPIED_SUCCESS_MESSAGE');
  });

  it('should call the translate service', () => {
    component.downloadIcsFile();
    fixture.detectChanges();
    const appointmentId = component.appoinmentDetailsData.id;
    expect(mockStore.dispatch).toHaveBeenCalledWith(
      actions.vendorAppointment.downloadVendorICS({ appointmentId: appointmentId as number }),
    );
  });

  it('should call the translate service', () => {
    component.initiateGoogleAuth();
    fixture.detectChanges();
    const integrationInfo: GoogleIntegrationInfo = {
      integrationMode: 'vendor-appointment',
      appointmentId: component.appoinmentDetailsData.id?.toString(),
    };
    expect(mockStore.dispatch).toHaveBeenCalledWith(
      actions.googleIntegration.getAuthenticationUrl({ integrationInfo }),
    );
  });
});
