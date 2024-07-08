import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewComponent } from './preview.component';
import { TranslateModule } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('PreviewComponent', () => {
  let component: PreviewComponent;
  let fixture: ComponentFixture<PreviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [PreviewComponent],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(PreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
