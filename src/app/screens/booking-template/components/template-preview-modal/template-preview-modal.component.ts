import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IconColor, IconName } from '@ds24/elements';
import { BookingTemplateDetail } from '../../../../types/booking.type';
import { Store } from '@ngrx/store';
import { actions } from '../../../../store';
@Component({
  selector: 'ds-template-preview-modal',
  templateUrl: './template-preview-modal.component.html',
})
export class TemplatePreviewModalComponent {
  @Input()
  bookingTemplate: BookingTemplateDetail | null = null;

  @Output() closePreviewPanel = new EventEmitter<void>();
  closeIcon: IconName = IconName.DialogClose;
  darkIconColor = IconColor.Neutral500;

  constructor(private store: Store) {
    this.store.dispatch(actions.timeZoneAPI.getTimeZones());
  }

  closePreviewModal() {
    this.bookingTemplate = null;
    this.closePreviewPanel.emit();
  }
}
