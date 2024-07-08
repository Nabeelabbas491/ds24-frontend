import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VendorManagementComponent } from './vendor-management.component';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TranslateMockPipe } from './../../../../shared/pipes/translate-mock.pipe';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { State } from '../../../../store/state';
import { actions } from '../../../../store';
import { VendorTabs } from '../../../../types/tab.type';

describe('VendorManagementComponent', () => {
  let component: VendorManagementComponent;
  let fixture: ComponentFixture<VendorManagementComponent>;
  let mockStore: MockStore<State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VendorManagementComponent, TranslateMockPipe],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [provideMockStore()],
    }).compileComponents();

    fixture = TestBed.createComponent(VendorManagementComponent);
    component = fixture.componentInstance;
    mockStore = TestBed.inject(MockStore);
    jest.spyOn(mockStore, 'dispatch');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call the routeChangeOnTab action', () => {
    const tabInfo = {
      id: VendorTabs.appointment,
      title: 'Appointment',
      urlSegment: 'appointment',
    };
    component.navigateToParticularPage(tabInfo);
    expect(mockStore.dispatch).toHaveBeenCalledWith(actions.vendor.routeChangeOnTabChange({ tabInfo }));
  });
});
