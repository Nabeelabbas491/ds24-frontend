import { createReducer, on, createAction, props, createFeatureSelector, createSelector } from '@ngrx/store';
import { BookingTemplate, DayDetail } from '../../types/vendor.types';
import { getSelectedTab, updateBookingTemplates, guessDefaultTimezone } from '../../shared/common/util';
import { Tab } from '../../types/tab.type';
import { TimeZone } from 'src/app/types/timezone.type';

export const featureKey = 'vendor';

export interface State {
  tabView: boolean;
  userFullName: string;
  appointmentTime: string;
  isModalForEdit: boolean;
  editIndex?: number;
  isModalOpen: boolean;
  bookingTemplates: BookingTemplate[];
  editedBookingTemplate: BookingTemplate | undefined;
  previewBookingTemplate: BookingTemplate;
  selectedTimeZone: string;
  dayDetails: DayDetail[];
  isPreviewModalOpen: boolean;
  addOverrideModal: boolean;
  errorMessage: string;
  tabItems: Tab[];
  timeZonePlaceHolder: string;
}

export const actions = {
  saveTabView: createAction('[Vendor] Change View', props<{ tabView: boolean }>()),
  redirectToVendorDetailPage: createAction('[Vendor] Navigate to page', props<{ detailsId: number }>()),
  redirectToAppointmentTab: createAction('[Vendor] Navigate to appointment tab'),
  redirectToBookingTemplatePage: createAction('[Vendor] Navigate to booking template page'),
  redirectToSettingsPage: createAction('[Vendor] Navigate to settings page'),
  saveBookingTemplateDetails: createAction(
    '[Vendor] booking template saved',
    props<{ bookingTemplate?: BookingTemplate; editIndex?: number; isModalOpen: boolean; isModalForEdit: boolean }>(),
  ),
  redirectToManageSchedulePage: createAction('[Vendor] Navigate to manage schedule page'),
  saveSelectedTimeZone: createAction('[Vendor] Save Selected TimeZone', props<{ selectedTimeZone: string }>()),
  saveTimeZonePlaceholder: createAction(
    '[Vendor] Save TimeZone Placeholder',
    props<{ timeZonePlaceholder: TimeZone }>(),
  ),
  loadDaysSuccess: createAction('[Vendor] Load Days Success', props<{ dayDetails: DayDetail[] }>()),
  loadPreviewModal: createAction(
    '[Vendor] Load Preview Modal Template',
    props<{ previewId?: number; isPreviewModalOpen: boolean }>(),
  ),
  setAddOverrideModalVisibilityStatus: createAction(
    '[Vendor] Toggle Add date override',
    props<{ addOverrideModal: boolean }>(),
  ),
  setErrorMessage: createAction('[Vendor] Set Error Messages', props<{ ErrorMessage: string }>()),
  setActiveTab: createAction('[Vendor] Set Active Tab', props<{ tabValue: string }>()),
  routeChangeOnTabChange: createAction('[Vendor] Route Change on Tab Change', props<{ tabInfo: Tab }>()),
};

export const initialState: State = {
  tabView: true,
  userFullName: 'Zain Curtis',
  appointmentTime: '12 Sept, Friday | 14:00 CET',
  isModalForEdit: false,
  isModalOpen: false,
  editIndex: undefined,
  bookingTemplates: [],
  editedBookingTemplate: {
    id: '',
    templateName: '',
    description: '',
    products: [],
    duration: '',
    bookingType: '',
    firstProduct: '',
    remainingProductCount: 0,
  },
  selectedTimeZone: guessDefaultTimezone(),
  dayDetails: [],
  previewBookingTemplate: {
    id: '',
    templateName: '',
    description: '',
    products: [],
    duration: '',
    bookingType: '',
    firstProduct: '',
    remainingProductCount: 0,
  },
  isPreviewModalOpen: false,
  addOverrideModal: false,
  errorMessage: '',
  tabItems: [
    {
      id: 0,
      title: 'Appointments',
      isSelected: false,
      urlSegment: 'appointments',
    },
    {
      id: 1,
      title: 'Booking Templates',
      isSelected: false,
      urlSegment: 'booking-templates',
    },
    {
      id: 2,
      title: 'Settings',
      isSelected: false,
      urlSegment: 'settings',
    },
  ],
  timeZonePlaceHolder: guessDefaultTimezone(),
};

export const reducer = createReducer(
  initialState,
  on(actions.saveTabView, (state, { tabView }) => ({ ...state, tabView })),
  on(actions.saveBookingTemplateDetails, (state, { bookingTemplate, editIndex, isModalOpen, isModalForEdit }) => {
    const editedBookingTemplate =
      editIndex !== undefined && bookingTemplate
        ? bookingTemplate
        : editIndex !== undefined
        ? state.bookingTemplates[editIndex]
        : undefined;

    const updatedBookingTemplates =
      bookingTemplate && !isModalForEdit ? [...state.bookingTemplates, bookingTemplate] : state.bookingTemplates;

    const allUpdatedBookingTemplates = updateBookingTemplates(editedBookingTemplate, updatedBookingTemplates);

    return {
      ...state,
      editIndex,
      bookingTemplates: allUpdatedBookingTemplates,
      editedBookingTemplate,
      isModalOpen: isModalOpen,
      isModalForEdit: isModalForEdit,
    };
  }),
  on(actions.saveSelectedTimeZone, (state, { selectedTimeZone }) => ({ ...state, selectedTimeZone })),
  on(actions.loadDaysSuccess, (state, { dayDetails }) => ({ ...state, dayDetails })),
  on(actions.loadPreviewModal, (state, { previewId, isPreviewModalOpen }) => {
    const previewBookingModal = previewId !== undefined ? state.bookingTemplates[previewId] : undefined;
    return {
      ...state,
      previewBookingTemplate: previewBookingModal as BookingTemplate,
      isPreviewModalOpen: isPreviewModalOpen,
    };
  }),
  on(actions.setAddOverrideModalVisibilityStatus, (state, { addOverrideModal }) => ({ ...state, addOverrideModal })),
  on(actions.setActiveTab, (state, { tabValue }) => {
    return {
      ...state,
      tabItems: getSelectedTab(state.tabItems, tabValue),
    };
  }),
  on(actions.saveTimeZonePlaceholder, (state, { timeZonePlaceholder }) => {
    const timezonePlaceholder = `${timeZonePlaceholder.name}, ${timeZonePlaceholder.abbreviatedTimeZone} ${timeZonePlaceholder.offset}`;
    return {
      ...state,
      timeZonePlaceHolder: timezonePlaceholder,
    };
  }),
);

// Selectors

export const selectSlice = createFeatureSelector<State>(featureKey);

export const selectors = {
  selectTabView: createSelector(selectSlice, (state: State) => state.tabView),
  selectUserName: createSelector(selectSlice, (state: State) => state.userFullName),
  selectAppointmentTime: createSelector(selectSlice, (state: State) => state.appointmentTime),
  selectIsModalForEdit: createSelector(selectSlice, (state: State) => state.isModalForEdit),
  selectIsModalOpen: createSelector(selectSlice, (state: State) => state.isModalOpen),
  selectSelectedTimeZone: createSelector(selectSlice, (state: State) => state.selectedTimeZone),
  selectInitialDays: createSelector(selectSlice, (state: State) => state.dayDetails),
  selectBookingTemplates: createSelector(selectSlice, (state: State) => state.bookingTemplates),
  selectPreviewTemplateName: createSelector(selectSlice, (state: State) => state.previewBookingTemplate),
  selectIsPreviewModalOpen: createSelector(selectSlice, (state: State) => state.isPreviewModalOpen),
  selectEditedBookingTemplate: createSelector(selectSlice, (state: State) => state.editedBookingTemplate),
  selectEditedIndex: createSelector(selectSlice, (state: State) => state.editIndex),
  selectOpenAddOverrideModal: createSelector(selectSlice, (state: State) => state.addOverrideModal),
  selectTabItems: createSelector(selectSlice, (state: State) => state.tabItems),
  selectPlaceholderTimeZone: createSelector(selectSlice, (state: State) => state.timeZonePlaceHolder),
};
