import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelledBadgeComponent } from './cancelled-badge.component';

describe('elementStatus', () => {
  let component: CancelledBadgeComponent;
  let fixture: ComponentFixture<CancelledBadgeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CancelledBadgeComponent],
    });
    fixture = TestBed.createComponent(CancelledBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
