import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GooglePopupMessageComponent } from './google-popup-message.component';
import { provideMockStore } from '@ngrx/store/testing';

describe('GooglePopupMessageComponent', () => {
  let component: GooglePopupMessageComponent;
  let fixture: ComponentFixture<GooglePopupMessageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GooglePopupMessageComponent],
      providers: [provideMockStore()],
    });
    fixture = TestBed.createComponent(GooglePopupMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
