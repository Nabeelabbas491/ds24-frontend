import { Component } from '@angular/core';
import { IconColor, IconName } from '@ds24/elements';
import { Store } from '@ngrx/store';
import { actions } from '../../../../store';
import { selectors } from '../../../../store';
import { Observable, takeUntil } from 'rxjs';
import { BookingTemplate } from 'src/app/types/vendor.types';
import { ReactiveLifecycles } from '@ds24/utilities';
import { PageBase } from 'src/app/types/misc.type';
import { isBeyondFirstOrLastPage } from './../../../../shared/common/util';
@Component({
  selector: 'ds-booking-template',
  templateUrl: './booking-template.component.html',
})
export class BookingTemplateComponent extends ReactiveLifecycles {
  icon: IconName = IconName.Plus;
  closeIcon: IconName = IconName.DialogClose;
  whiteIconColor = IconColor.white;
  spinnerColor = IconColor.Primary300;
  darkIconColor = IconColor.Neutral500;
  isModalOpen$: Observable<boolean> = this.store.select(selectors.vendor.selectIsModalOpen);
  openPreviewModal$: Observable<boolean> = this.store.select(selectors.vendor.selectIsPreviewModalOpen);
  previewTemplateDetail: BookingTemplate | undefined;

  bookingTemplateList$ = this.store.select(selectors.vendorBookingTemplate.selectBookingTemplateList);
  isBookingTemplateListPending$ = this.store.select(selectors.vendorBookingTemplate.selectBookingTemplateListPending);

  bookingTemplateFormCollection$ = this.store.select(selectors.vendorBookingTemplate.selectBookingTemplateCollection);
  isBookingTemplateCollectionPending$ = this.store.select(
    selectors.vendorBookingTemplate.selectBookingTemplateCollectionPending,
  );

  isBookingTemplatePreviewPending$ = this.store.select(selectors.bookingAPI.selectBookingTemplatePending);
  bookingTemplatePreviewSuccess$ = this.store.select(selectors.bookingAPI.selectBookingTemplateSuccess);

  constructor(private store: Store) {
    super();
    this.store
      .select(selectors.vendor.selectPreviewTemplateName)
      .pipe(takeUntil(this.ngOnDestroy$))
      .subscribe(template => {
        this.previewTemplateDetail = template;
      });

    this.loadBookingTemplateList();
  }

  openBookingModal() {
    this.store.dispatch(actions.vendorBookingTemplate.openCreateBookingModal());
  }

  openUpdatePanel(bookingTemplateId: number) {
    this.store.dispatch(actions.vendorBookingTemplate.openEditBookingModal({ bookingTemplateId }));
  }

  closeBookingTemplateModal(reload: boolean) {
    this.store.dispatch(actions.vendorBookingTemplate.closeBookingModal());
    if (reload) {
      this.loadBookingTemplateList();
    }
  }

  openPreviewModal(productId: string) {
    this.store.dispatch(
      actions.bookingAPI.getBookingTemplate({ paramDetails: { paramId: productId, isClient: false } }),
    );
  }

  closePreviewModal() {
    this.store.dispatch(actions.bookingAPI.resetBookingTemplate());
  }

  loadBookingTemplateList() {
    this.store.dispatch(actions.vendorBookingTemplate.getBookingTemplateList());
  }

  pageChange(currentPage: number, pageBase: PageBase) {
    if (!isBeyondFirstOrLastPage(pageBase, currentPage)) {
      this.store.dispatch(actions.vendorBookingTemplate.setBookingTemplateListCurrentPage({ currentPage }));
    }
  }

  ngOnDestroy(): void {
    this.store.dispatch(actions.vendor.loadPreviewModal({ isPreviewModalOpen: false }));
  }
}
