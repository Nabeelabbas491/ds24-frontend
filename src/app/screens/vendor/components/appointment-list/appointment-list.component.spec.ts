import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppointmentListComponent } from './appointment-list.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { State, actions } from '../../../../store';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { VendorListingParamType, SortType } from '../../../../types/vendor.types';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';

describe('AppointmentListComponent', () => {
  let component: AppointmentListComponent;
  let fixture: ComponentFixture<AppointmentListComponent>;
  let mockStore: MockStore<State>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppointmentListComponent],
      providers: [provideMockStore()],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });
    mockStore = TestBed.inject(MockStore);
    jest.spyOn(mockStore, 'dispatch');
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppointmentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to details page when showDetailsPage is called', () => {
    const detailsPageIndex = 1;
    component.showDetailsPage(detailsPageIndex);
    fixture.detectChanges();
    const detailsId = 1;
    expect(mockStore.dispatch).toHaveBeenCalledWith(
      actions.vendorAppointment.redirectToVendorDetailPage({ detailsId }),
    );
  });

  it('toggles isSortAscending', () => {
    expect(component.isSortAscending).toBe(true);
    component.sortTableData();
    expect(component.isSortAscending).toBe(false);
  });

  it('calls dispatch with correct parameters', () => {
    component.sortTableData();
    expect(mockStore.dispatch).toHaveBeenCalled();
    expect(mockStore.dispatch).toHaveBeenCalledWith(
      actions.vendorAppointment.updateListParam({
        paramName: VendorListingParamType.SORTORDER,
        paramValue: SortType.DESCENDING,
      }),
    );

    component.sortTableData();
    expect(mockStore.dispatch).toHaveBeenCalledWith(
      actions.vendorAppointment.updateListParam({
        paramName: VendorListingParamType.SORTORDER,
        paramValue: SortType.ASCENDING,
      }),
    );
  });
});
