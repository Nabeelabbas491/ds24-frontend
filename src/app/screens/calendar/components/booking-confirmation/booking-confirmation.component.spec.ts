import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingConfirmationComponent } from './booking-confirmation.component';
import { TranslateFakeLoader, TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { IconModule } from '@ds24/elements';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { PipesModule } from '../../../../shared/pipes/pipes.module';
import { State } from '../../../../store/state';
import { of } from 'rxjs';
import { TranslateMockPipe } from './../../../../shared/pipes/translate-mock.pipe';
import { actions } from './../../../../store';
import { Clipboard } from '@angular/cdk/clipboard';

describe('BookingConfirmationComponent', () => {
  let component: BookingConfirmationComponent;
  let fixture: ComponentFixture<BookingConfirmationComponent>;
  let mockStore: MockStore<State>;

  const clipboardMock = {
    copy: jest.fn(),
  };

  const mockTranslateService = {
    get: jest.fn().mockImplementation(() => of('sample message')),
    instant: jest.fn().mockReturnValue('sample message'),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BookingConfirmationComponent, TranslateMockPipe],
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
        IconModule,
        PipesModule,
      ],
    });
    fixture = TestBed.createComponent(BookingConfirmationComponent);
    component = fixture.componentInstance;
    mockStore = TestBed.inject(MockStore);
    jest.spyOn(mockStore, 'dispatch');
    fixture.detectChanges();
  });

  it('should compile', () => {
    fixture.detectChanges();
    expect(component).toMatchSnapshot();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should copy vendor phone number to clipboard', () => {
    component.copyPhone('+1234567');
    expect(clipboardMock.copy).toHaveBeenCalledWith('+1234567');
  });

  it('should copy Zoom link to clipboard', () => {
    component.copyZoomLink('http://test.com');
    expect(clipboardMock.copy).toHaveBeenCalledWith('http://test.com');
  });

  it('should call the snackbar popup', () => {
    component.showSnackbarMessage('SAMPLE_TRANSLATION');
    fixture.detectChanges();
    expect(mockStore.dispatch).toHaveBeenCalledWith(
      actions.notification.callSnackBarPopup({ snackBarMessage: 'sample message' }),
    );
  });

  it('should call the translate service', () => {
    const translation = 'BOOKING.BOOKING_CONFIRMATION.VENDOR_PHONE_NUMBER_COPIED';
    component.showSnackbarMessage(translation);
    fixture.detectChanges();
    expect(mockTranslateService.instant).toHaveBeenCalledWith(translation);
  });
});
