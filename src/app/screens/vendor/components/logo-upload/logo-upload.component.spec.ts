import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LogoUploadComponent } from './logo-upload.component';
import { TranslateModule } from '@ngx-translate/core';
import { provideMockStore } from '@ngrx/store/testing';

describe('LogoUploadComponent', () => {
  let component: LogoUploadComponent;
  let fixture: ComponentFixture<LogoUploadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [LogoUploadComponent],
      providers: [provideMockStore()],
    });

    fixture = TestBed.createComponent(LogoUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
