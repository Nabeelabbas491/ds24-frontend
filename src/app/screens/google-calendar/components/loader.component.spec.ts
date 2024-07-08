import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoaderComponent } from './loader.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { State, actions } from './../../../store';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { GoogleIntegrationInfo } from '../../../types/google-integration.type';
import { saveIntegrationInfo } from '../../../shared/common/util';

describe('LoaderComponent', () => {
  let component: LoaderComponent;
  let fixture: ComponentFixture<LoaderComponent>;
  let mockStore: MockStore<State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoaderComponent],
      imports: [RouterTestingModule],
      providers: [
        provideMockStore(),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParamMap: convertToParamMap({ code: 'xyz' }),
            },
          },
        },
      ],
    });
    fixture = TestBed.createComponent(LoaderComponent);
    component = fixture.componentInstance;
    mockStore = TestBed.inject(MockStore);
    fixture.detectChanges();
    jest.spyOn(mockStore, 'dispatch');
  });

  it('should compile', () => {
    fixture.detectChanges();
    expect(component).toMatchSnapshot();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call the syncAppointmentClient if the integrationMode is client-appointment', () => {
    const code = 'xyz';
    const integrationInfo: GoogleIntegrationInfo = {
      integrationMode: 'client-booking',
      bookingProductId: '123',
    };

    saveIntegrationInfo(integrationInfo);

    component.ngOnInit();
    fixture.detectChanges();

    expect(mockStore.dispatch).toHaveBeenCalledWith(
      actions.googleIntegration.syncAppointmentClient({
        bookingProductId: integrationInfo.bookingProductId as string,
        code,
      }),
    );
  });

  it('should call the googleConnect if the integrationMode is vendor-appointment', () => {
    const code = 'xyz';
    const integrationInfo: GoogleIntegrationInfo = {
      integrationMode: 'vendor-appointment',
      appointmentId: '123',
    };

    saveIntegrationInfo(integrationInfo);

    component.ngOnInit();
    fixture.detectChanges();

    expect(mockStore.dispatch).toHaveBeenCalledWith(
      actions.googleIntegration.googleConnect({
        code,
      }),
    );
  });
});
