import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CopyInfoBoxComponent } from './copy-info-box.component';

describe('CopyInfoBoxComponent', () => {
  let component: CopyInfoBoxComponent;
  let fixture: ComponentFixture<CopyInfoBoxComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CopyInfoBoxComponent],
    });
    fixture = TestBed.createComponent(CopyInfoBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compile', () => {
    fixture.detectChanges();
    expect(component).toMatchSnapshot();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
