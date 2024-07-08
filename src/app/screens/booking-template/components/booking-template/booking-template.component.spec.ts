import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { BookingTemplateComponent } from './booking-template.component';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { State, actions } from '../../../../store';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { PageBase } from './../../../../types/misc.type';

describe('BookingTemplateComponent', () => {
  let component: BookingTemplateComponent;
  let fixture: ComponentFixture<BookingTemplateComponent>;
  let mockStore: MockStore<State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BookingTemplateComponent],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
      providers: [provideMockStore()],
      schemas: [NO_ERRORS_SCHEMA],
    });
    fixture = TestBed.createComponent(BookingTemplateComponent);
    component = fixture.componentInstance;
    mockStore = TestBed.inject(MockStore);
    jest.spyOn(mockStore, 'dispatch');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch the action on calling openPreviewModal method', () => {
    const productId: string = 'xyz-123-abc';
    component.openPreviewModal(productId);

    expect(mockStore.dispatch).toHaveBeenCalledWith(
      actions.bookingAPI.getBookingTemplate({ paramDetails: { paramId: productId, isClient: false } }),
    );
  });

  it('should call the action closePreviewModal', () => {
    component.closePreviewModal();
    expect(mockStore.dispatch).toHaveBeenCalledWith(actions.bookingAPI.resetBookingTemplate());
  });

  it('should call the action getBookingTemplateList on loadBookingTemplateList', () => {
    component.loadBookingTemplateList();
    expect(mockStore.dispatch).toHaveBeenCalledWith(actions.vendorBookingTemplate.getBookingTemplateList());
  });

  it('should dispatch openCreateBookingModal action when calling openBookingModal', () => {
    component.openBookingModal();

    expect(mockStore.dispatch).toHaveBeenCalledWith(actions.vendorBookingTemplate.openCreateBookingModal());
  });

  it('should dispatch openEditBookingModal action with correct payload when calling openUpdatePanel', () => {
    const bookingTemplateId = 123;

    component.openUpdatePanel(bookingTemplateId);

    expect(mockStore.dispatch).toHaveBeenCalledWith(
      actions.vendorBookingTemplate.openEditBookingModal({ bookingTemplateId }),
    );
  });

  it('should call loadBookingTemplateList when calling closeBookingTemplateModal with reload=true', () => {
    const loadBookingTemplateListSpy = jest.spyOn(component, 'loadBookingTemplateList');

    component.closeBookingTemplateModal(true);

    expect(loadBookingTemplateListSpy).toHaveBeenCalled();
  });

  it('should not call loadBookingTemplateList when calling closeBookingTemplateModal with reload=false', () => {
    const loadBookingTemplateListSpy = jest.spyOn(component, 'loadBookingTemplateList');

    component.closeBookingTemplateModal(false);

    expect(loadBookingTemplateListSpy).not.toHaveBeenCalled();
  });

  it('should dispatch setBookingTemplateListCurrentPage action with correct payload when calling pageChange', () => {
    const currentPage = 2;

    const pageBase: PageBase = {
      total: 10,
      limit: 5,
      page: 1,
    };

    component.pageChange(currentPage, pageBase);

    expect(mockStore.dispatch).toHaveBeenCalledWith(
      actions.vendorBookingTemplate.setBookingTemplateListCurrentPage({ currentPage }),
    );
  });
});
