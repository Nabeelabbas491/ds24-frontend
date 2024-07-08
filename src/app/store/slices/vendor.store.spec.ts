import { reducer, initialState, actions, selectors } from './vendor.store';
import { dayDetails } from '../../types/vendor.types.mock';

describe('Vendor Reducer', () => {
  it('should return the initial state', () => {
    const action = { type: 'Unknown Action' };
    const state = reducer(undefined, action);
    expect(state).toBe(initialState);
  });

  it('should handle saveTabView action', () => {
    const tabView = true;
    const action = actions.saveTabView({ tabView });
    const state = reducer(initialState, action);
    expect(state.tabView).toBe(tabView);
  });

  it('should toggle addOverrideModal visibility', () => {
    const newState = reducer(initialState, actions.setAddOverrideModalVisibilityStatus({ addOverrideModal: true }));

    expect(newState.addOverrideModal).toBe(true);
  });

  it('should handle loadDaysSuccess action', () => {
    const dayDetailsData = dayDetails;
    const action = actions.loadDaysSuccess({ dayDetails: dayDetailsData });
    const state = reducer(initialState, action);
    expect(state.dayDetails).toBe(dayDetails);
  });

  it('should handle saveSelectTimezone action', () => {
    const selectedTimeZone = 'Asia/Calcutta';
    const action = actions.saveSelectedTimeZone({ selectedTimeZone });
    const state = reducer(initialState, action);
    expect(state.selectedTimeZone).toBe(selectedTimeZone);
  });

  it('should handle saveBookingTemplateDetails action', () => {
    const bookingTemplate = {
      id: '0',
      templateName: '',
      description: '',
      products: [],
      duration: '',
      bookingType: '',
      firstProduct: '',
      remainingProductCount: 0,
    };

    const editIndex = undefined;
    const isModalOpen = true;
    const isModalForEdit = false;

    const action = actions.saveBookingTemplateDetails({
      bookingTemplate,
      editIndex,
      isModalOpen,
      isModalForEdit,
    });

    const newState = reducer(initialState, action);

    expect(newState.editIndex).toBe(editIndex);
    expect(newState.isModalOpen).toBe(isModalOpen);
    expect(newState.isModalForEdit).toBe(isModalForEdit);

    if (bookingTemplate && !isModalForEdit) {
      expect(newState.bookingTemplates).toContainEqual(bookingTemplate);
    }
  });

  it('should handle saveBookingTemplateDetails action with editing', () => {
    const bookingTemplate = {
      id: '0',
      templateName: '',
      description: '',
      products: [],
      duration: '',
      bookingType: '',
      firstProduct: '',
      remainingProductCount: 0,
    };

    const editIndex = 0;
    const isModalOpen = true;
    const isModalForEdit = true;

    const action = actions.saveBookingTemplateDetails({
      bookingTemplate,
      editIndex,
      isModalOpen,
      isModalForEdit,
    });

    const newState = reducer(initialState, action);

    expect(newState.editIndex).toBe(editIndex);
    expect(newState.isModalOpen).toBe(isModalOpen);
    expect(newState.isModalForEdit).toBe(isModalForEdit);

    const editedBookingTemplate = initialState.bookingTemplates[editIndex];
    const allUpdatedBookingTemplates = initialState.bookingTemplates.map(template => {
      if (template === editedBookingTemplate) {
        return bookingTemplate;
      }
      return template;
    });

    expect(newState.bookingTemplates).toEqual(allUpdatedBookingTemplates);
  });

  it('should handle loadPreviewModal action', () => {
    const previewId = 0;
    const isPreviewModalOpen = true;

    const action = actions.loadPreviewModal({
      previewId,
      isPreviewModalOpen,
    });

    const newState = reducer(initialState, action);

    expect(newState.isPreviewModalOpen).toBe(isPreviewModalOpen);

    if (previewId !== undefined) {
      const previewBookingModal = initialState.bookingTemplates[previewId];
      expect(newState.previewBookingTemplate).toEqual(previewBookingModal);
    } else {
      expect(newState.previewBookingTemplate).toBeUndefined();
    }
  });

  it('should set the active tab correctly', () => {
    const tabValue = 'exampleTab';
    const action = actions.setActiveTab({ tabValue });

    const newState = reducer(initialState, action);

    expect(newState.tabItems).toEqual(
      initialState.tabItems.map(tab => ({
        ...tab,
        isSelected: tab.urlSegment === tabValue,
      })),
    );
  });

  it('should chage the timeZonePlaceHolder correctly', () => {
    const timeZonePlaceholder = {
      name: 'UTC',
      abbreviatedTimeZone: 'UTC',
      offset: '+00:00',
    };
    const action = actions.saveTimeZonePlaceholder({ timeZonePlaceholder });

    const newState = reducer(initialState, action);

    expect(newState.timeZonePlaceHolder).toEqual(
      `${timeZonePlaceholder.name}, ${timeZonePlaceholder.abbreviatedTimeZone} ${timeZonePlaceholder.offset}`,
    );
  });
});

describe('Vendor Selectors', () => {
  it('should select tab view', () => {
    const tabView = true;
    const result = selectors.selectTabView.projector(initialState);
    expect(result).toBe(tabView);
  });

  it('should select user name', () => {
    const userFullName = 'Zain Curtis';
    const result = selectors.selectUserName.projector(initialState);
    expect(result).toBe(userFullName);
  });

  it('should select appointment time', () => {
    const appointmentTime = '12 Sept, Friday | 14:00 CET';
    const result = selectors.selectAppointmentTime.projector(initialState);
    expect(result).toBe(appointmentTime);
  });

  it('should select isModalForEdit', () => {
    const selectedValue = selectors.selectIsModalForEdit.projector(initialState);
    expect(selectedValue).toBe(false);
  });

  it('should select isModalOpen', () => {
    const selectedValue = selectors.selectIsModalOpen.projector(initialState);
    expect(selectedValue).toBe(false);
  });

  it('should select selectedTimeZone', () => {
    const selectedValue = selectors.selectSelectedTimeZone.projector(initialState);
    expect(selectedValue).toBe(initialState.selectedTimeZone);
  });
  it('should select initial days', () => {
    const selectedValue = selectors.selectInitialDays.projector(initialState);
    expect(selectedValue).toEqual([]);
  });

  it('should select openAddOverrideModal', () => {
    const selectedValue = selectors.selectOpenAddOverrideModal.projector(initialState);
    expect(selectedValue).toBe(false);
  });

  it('should select booking templates', () => {
    const result = selectors.selectBookingTemplates.projector(initialState);
    expect(result).toEqual(initialState.bookingTemplates);
  });

  it('should select preview template name', () => {
    const result = selectors.selectPreviewTemplateName.projector(initialState);
    expect(result).toEqual(initialState.previewBookingTemplate);
  });

  it('should select isPreviewModalOpen', () => {
    const result = selectors.selectIsPreviewModalOpen.projector(initialState);
    expect(result).toEqual(initialState.isPreviewModalOpen);
  });

  it('should select edited booking template', () => {
    const result = selectors.selectEditedBookingTemplate.projector(initialState);
    expect(result).toEqual(initialState.editedBookingTemplate);
  });

  it('should select edited index', () => {
    const result = selectors.selectEditedIndex.projector(initialState);
    expect(result).toEqual(initialState.editIndex);
  });
});
