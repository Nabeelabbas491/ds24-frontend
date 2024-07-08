import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TemplatePreviewModalComponent } from './template-preview-modal.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { State } from '../../../../store';

describe('TemplatePreviewModalComponent', () => {
  let component: TemplatePreviewModalComponent;
  let fixture: ComponentFixture<TemplatePreviewModalComponent>;
  let mockStore: MockStore<State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TemplatePreviewModalComponent],
      providers: [provideMockStore()],
      schemas: [NO_ERRORS_SCHEMA],
    });
    fixture = TestBed.createComponent(TemplatePreviewModalComponent);
    component = fixture.componentInstance;
    mockStore = TestBed.inject(MockStore);
    jest.spyOn(mockStore, 'dispatch');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
