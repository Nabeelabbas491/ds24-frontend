import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingTemplateModalComponent } from './booking-template-modal.component';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { State, actions } from '../../../../store';
import { DropdownModule, DsFormsModule, DsSelectModule, DsToggleswitchModule, ModalModule } from '@ds24/elements';
import { DEFAULT_ELEMENT_LENGTHS } from '../../../../shared/common/util';
import { BookingTemplateListItem } from '../../../../types/vendor.booking-template.type';
import { BookingTemplateCollection, SaveBookingTemplate } from '../../../../types/vendor.types';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { BookingTypeDescriptionPipe } from '../../../../shared/pipes/booking-type-description.pipe';

describe('BookingTemplateModalComponent', () => {
  let component: BookingTemplateModalComponent;
  let fixture: ComponentFixture<BookingTemplateModalComponent>;
  let mockStore: MockStore<State>;
  let router: Router;
  let formBuilder: FormBuilder;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BookingTemplateModalComponent, BookingTypeDescriptionPipe],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
        RouterTestingModule,
        ReactiveFormsModule,
        FormsModule,
        DsSelectModule,
        DropdownModule,
        DsToggleswitchModule,
        DsFormsModule,
        ModalModule,
      ],
      providers: [provideMockStore()],
      schemas: [NO_ERRORS_SCHEMA],
    });
    fixture = TestBed.createComponent(BookingTemplateModalComponent);
    component = fixture.componentInstance;
    mockStore = TestBed.inject(MockStore);
    jest.spyOn(mockStore, 'dispatch');
    router = TestBed.inject(Router);
    formBuilder = TestBed.inject(FormBuilder);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should listen to valueChanges and update leftCountName$', (done: any) => {
    fixture.detectChanges();
    const testName = 'Test Template';
    component.bookingTemplateForm.get('templateName')?.setValue(testName);
    component.leftCountName$.subscribe(value => {
      expect(value).toBe(Math.max(0, DEFAULT_ELEMENT_LENGTHS.BOOKING_TEMPLATE_NAME_LENGTH - testName.length));
      done();
    });
  });

  it('should listen to valueChanges and update leftCountDescription$', (done: any) => {
    fixture.detectChanges();
    const testDescription = 'Test Description';
    component.bookingTemplateForm.get('description')?.setValue(testDescription);
    component.leftCountDescription$.subscribe(value => {
      expect(value).toBe(
        Math.max(0, DEFAULT_ELEMENT_LENGTHS.BOOKING_TEMPLATE_COMMENTS_LENGTH - testDescription.length),
      );
      done();
    });
  });

  it('should make the form valid when valid entries are entered', () => {
    const bookingTemplate = {
      templateName: 'My Booking Template',
      description: 'This is a booking template.',
      products: [1, 2],
      duration: 30,
      vendorPhoneNumber: '123456',
      meetingTypes: [],
    };
    component.bookingTemplateForm.setValue(bookingTemplate);

    component.bookingTemplateForm.markAllAsTouched();
    expect(component.bookingTemplateForm.valid).toBeTruthy();
  });

  it('should make the form invalid when invalid entries are entered', () => {
    const bookingTemplate = {
      templateName:
        'My text count is more than fortyMy text count is more than fortyMy text count is more than fortyMy text count is more than fortyMy text count is more than fortyMy text count is more than fortyMy text count is more than fortyMy text count is more than forty',
      description: '',
      products: [1, 2],
      duration: 30,
      vendorPhoneNumber: '123456',
      meetingTypes: [],
    };
    component.bookingTemplateForm.setValue(bookingTemplate);

    expect(component.bookingTemplateForm.valid).toBeFalsy();
    expect(component.bookingTemplateForm.get('templateName')?.valid).toBeFalsy();
  });

  it('should make the entries as dirty and touched when form state is invalid', () => {
    const bookingTemplate = {
      templateName:
        'My Booking Template My Booking TemplateMy Booking TemplateMy Booking TemplateMy Booking TemplateMy Booking TemplateMy Booking TemplateMy Booking TemplateMy Booking Template',
      description: '',
      products: [1, 2],
      duration: 30,
      vendorPhoneNumber: '123-456',
      meetingTypes: [],
    };
    component.bookingTemplateForm.setValue(bookingTemplate);
    component.alreadyAttachedMeetingProductList = [];
    component.submitBookingTemplateModal();
    expect(component.bookingTemplateForm.controls['templateName'].touched).toBe(true);
    expect(component.bookingTemplateForm.controls['templateName'].dirty).toBe(true);
    expect(component.bookingTemplateForm.controls['description'].touched).toBe(true);
    expect(component.bookingTemplateForm.controls['description'].dirty).toBe(true);
  });

  it('should close the booking modal and save the data when the booking form is valid', () => {
    const bookingTemplateForm = {
      templateName: 'My Booking Template',
      description: 'This is a booking template.',
      products: [1, 2],
      duration: 30,
      vendorPhoneNumber: '123-456',
      meetingTypes: [],
    };
    component.bookingTemplateForm.setValue(bookingTemplateForm);

    component.bookingTemplateForm.markAllAsTouched();
    component.submitBookingTemplateModal();

    const saveBookingTemplate: SaveBookingTemplate = {
      name: 'My Booking Template',
      description: 'This is a booking template.',
      duration: 30,
      products: [1, 2],
      phoneNumber: '123-456',
      meetingTypes: [],
    };

    expect(mockStore.dispatch).toHaveBeenCalledWith(
      actions.vendorBookingTemplate.upsertBookingTemplate({ saveBookingTemplate }),
    );
  });

  it('should reset the bookingTemplateForm', () => {
    component.resetBookingModal();
    expect(component.bookingTemplateCollection).toBe(null);
  });

  it('should populate form values correctly when provided a BookingTemplateListItem', () => {
    const bookingTemplateDetail = {
      id: 1,
      name: 'Template Name',
      description: 'Template Description',
      duration: 60,
      bookingMeetingTypes: [
        { id: 1, name: 'product-1' },
        { id: 2, name: 'product-2' },
      ],
      bookingProducts: [
        { id: 1, name: 'MeetingType1', uuid: 'sdaisdjidjsd' },
        { id: 2, name: 'MeetingType2', uuid: 'sdaisdjidjsd' },
      ],
    } as BookingTemplateListItem;

    component.populateFormValues(bookingTemplateDetail);

    expect(component.formControls.templateName.value).toEqual(bookingTemplateDetail.name);
    expect(component.formControls.description.value).toEqual(bookingTemplateDetail.description);
    expect(component.formControls.duration.value).toEqual(`${bookingTemplateDetail.duration}`);
    expect(component.formControls.products.value).toEqual(bookingTemplateDetail.bookingProducts.map(x => `${x.id}`));

    component.bookingTemplateCollection?.vendorSetting?.meetingTypes.forEach((meetingType, index) => {
      const isSelected = bookingTemplateDetail.bookingMeetingTypes.some(
        btMeetingType => btMeetingType.id === meetingType.id && btMeetingType.name === meetingType.name,
      );
      expect(component.meetingTypesFormArray.controls[index].value).toEqual({ meetingType: isSelected });
    });
  });

  it('should not throw an error when provided a null BookingTemplateListItem', () => {
    const bookingTemplateDetail = null;

    expect(() => component.populateFormValues(bookingTemplateDetail)).not.toThrow();
  });

  it('should create meetingTypesFormArray with the correct length and populate form values in edit mode', () => {
    const meetingType1 = { id: 1, name: 'MeetingType1' };
    const meetingType2 = { id: 2, name: 'MeetingType2' };
    const bookingTemplateDetail = {
      id: 1,
      name: 'Template Name',
      description: 'Template Description',
      duration: 60,
      bookingProducts: [],
      bookingMeetingTypes: [meetingType1, meetingType2],
    };
    const vendorSetting = {
      id: 1,
      logo: 'test.jpg',
      primaryColor: 'black',
      secondaryColor: 'white',
      phoneNumber: '123456',
      meetingTypes: [meetingType1, meetingType2],
    };
    const bookingTemplateCollection: BookingTemplateCollection = {
      meetingProducts: [],
      modalState: 'edit',
      vendorSetting,
      bookingTemplateDetail,
    };

    component.bookingTemplateFormCollection = bookingTemplateCollection;

    expect(component.meetingTypesFormArray.length).toEqual(2);
    expect(component.formControls.templateName.value).toEqual(bookingTemplateDetail.name);
    expect(component.formControls.description.value).toEqual(bookingTemplateDetail.description);
    expect(component.formControls.duration.value).toEqual(`${bookingTemplateDetail.duration}`);
  });

  it('should create meetingTypesFormArray with the correct length in non-edit mode', () => {
    const meetingType1 = { id: 1, name: 'MeetingType1' };
    const meetingType2 = { id: 2, name: 'MeetingType2' };
    const bookingTemplateDetail = {
      id: 1,
      name: 'Template Name',
      description: 'Template Description',
      duration: 60,
      bookingProducts: [],
      bookingMeetingTypes: [meetingType1, meetingType2],
    };
    const vendorSetting = {
      id: 1,
      logo: 'test.jpg',
      primaryColor: 'black',
      secondaryColor: 'white',
      phoneNumber: '123456',
      meetingTypes: [meetingType1, meetingType2],
    };
    const bookingTemplateCollection: BookingTemplateCollection = {
      modalState: 'create',
      meetingProducts: [],
      bookingTemplateDetail,
      vendorSetting,
    };

    component.bookingTemplateFormCollection = bookingTemplateCollection;

    expect(component.meetingTypesFormArray.length).toEqual(2);
  });

  it('should remove product by id', () => {
    component.bookingTemplateForm.value.products = [1, 2, 3];
    fixture.detectChanges();
    component.removeProductById(2);
    expect(component.bookingTemplateForm.value.products).toEqual([1, 3]);
  });

  it('should add product by in alreadyAttachedMeetingProductList ', () => {
    component.alreadyAttachedMeetingProductList = [
      {
        id: '1',
        product_group_id: '20',
        name: 'test-product',
        vendor_id: 'test',
        product_group_name: 'test',
        is_attached: true,
      },
    ];
    fixture.detectChanges();
    component.switchProductById('1');
    expect(component.alreadyAttachedMeetingProductList).toEqual([]);
  });

  it('should navigate to settings route', () => {
    const navigateSpy = jest.spyOn(router, 'navigate');
    component.navigateToSettings();
    expect(navigateSpy).toHaveBeenCalledWith(['/vendor/settings']);
  });

  it('should return the value of the specified field', () => {
    component.bookingTemplateForm = formBuilder.group({
      fieldName1: ['Value1'],
      fieldName2: ['Value2'],
    });

    fixture.detectChanges();

    const fieldName = 'fieldName1';
    const fieldValue = component.getFieldValue(fieldName);

    expect(fieldValue).toEqual('Value1');
  });

  it('should call resetBookingModal and emit false through closeTemplatePanel', () => {
    jest.spyOn(component, 'resetBookingModal');

    const closeTemplatePanelSpy = jest.spyOn(component.closeTemplatePanel, 'emit');

    component.cancelBookingModal();

    expect(component.resetBookingModal).toHaveBeenCalled();

    expect(closeTemplatePanelSpy).toHaveBeenCalledWith(false);
  });

  it('should mark FormControl as touched and dirty', () => {
    jest.spyOn(component, 'markFormControlsAsTouched');

    const formGroup = new FormGroup({
      name: new FormControl('', [Validators.required]),
    });

    component.markFormControlsAsTouched(formGroup);

    expect(formGroup.get('name')?.touched).toBe(true);
    expect(formGroup.get('name')?.dirty).toBe(true);
  });

  it('should mark FormGroup as touched and dirty with at least one control', () => {
    // Create a mock FormGroup with another FormGroup
    const innerFormGroup = new FormGroup({
      subName: new FormControl('', [Validators.required]),
    });
    const formGroup = new FormGroup({
      group: innerFormGroup,
    });

    // Call markFormControlsAsTouched method
    component.markFormControlsAsTouched(formGroup);

    // Expect the FormGroup to be marked as touched and dirty with errors set
    expect(formGroup.get('group')?.touched).toBe(true);
    expect(formGroup.get('group')?.dirty).toBe(true);
    expect(formGroup.get('group')?.errors?.atLeastOneSelected).toBe(true);
  });

  it('should update alreadyAttachedMeetingProductList based on form value changes', () => {
    jest.spyOn(component, 'setWarningProductsList');

    const meetingProduct = {
      id: '1',
      product_group_id: '',
      name: 'test',
      vendor_id: 'test-id',
      product_group_name: 'test',
      is_attached: true,
    };

    const meetingType1 = { id: 1, name: 'MeetingType1' };
    const meetingType2 = { id: 2, name: 'MeetingType2' };
    const bookingTemplateDetail = {
      id: 1,
      name: 'Template Name',
      description: 'Template Description',
      duration: 60,
      bookingProducts: [{ id: 1, name: 'test', uuid: '1' }],
      bookingMeetingTypes: [meetingType1, meetingType2],
    };
    const vendorSetting = {
      id: 1,
      logo: 'test.jpg',
      primaryColor: 'black',
      secondaryColor: 'white',
      phoneNumber: '123456',
      meetingTypes: [meetingType1, meetingType2],
    };
    const bookingTemplateCollection: BookingTemplateCollection = {
      meetingProducts: [meetingProduct],
      modalState: 'edit',
      vendorSetting,
      bookingTemplateDetail,
    };

    component.bookingTemplateFormCollection = bookingTemplateCollection;

    const newValue = ['1'];

    component.setWarningProductsList(newValue);

    expect(component.alreadyAttachedMeetingProductList).toEqual([]);
  });
});
