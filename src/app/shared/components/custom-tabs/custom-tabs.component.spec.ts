import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomTabsComponent } from './custom-tabs.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('TabsComponent', () => {
  let component: CustomTabsComponent;
  let fixture: ComponentFixture<CustomTabsComponent>;
  let button: DebugElement;
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomTabsComponent],
    });
    fixture = TestBed.createComponent(CustomTabsComponent);
    component = fixture.componentInstance;
    component.items = [{ title: 'Settings', id: 0 }];
    fixture.detectChanges();
    button = fixture.debugElement.query(By.css('button'));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call the selectTab function on click ', () => {
    jest.spyOn(component, 'selectTab');
    button.triggerEventHandler('click', {});
    fixture.detectChanges();
    expect(component.selectTab).toHaveBeenCalled();
  });

  it('should emit the event on click', () => {
    let eventEmitted = false;
    component.tabSelected.subscribe(() => {
      eventEmitted = true;
    });
    button.triggerEventHandler('click', {});
    expect(eventEmitted).toBe(true);
  });
});
