import { createAction, createFeatureSelector, createReducer, createSelector, on, props } from '@ngrx/store';
import { SaveVendorSetting, VendorSettingCollection, VendorSettingsForm } from '../../types/vendor-settings.type';
import { SettingPageState } from 'src/app/types/misc.type';

export const featureKey = 'vendor-settings';

const defaultPrimaryColor = '#3988e3';
const defaultSecondaryColor = '#ced9e0';
export interface State {
  vendorSettingsCollectionError: string | null;
  vendorSettingsCollectionPending: boolean;
  vendorSettingsCollection: VendorSettingCollection | undefined;

  saveVendorSettingError: string | null;
  saveVendorSettingPending: boolean;
  saveVendorSettingSuccess: string | null;

  removeVendorLogoError: string | null;
  removeVendorLogoPending: boolean;
  removeVendorLogoSuccess: string | null;

  form: VendorSettingsForm;
  formError: any;
  formSuccess: string;
  formPending: boolean;
  primaryColor: string;
  secondaryColor: string;
}

export const initialState: State = {
  vendorSettingsCollectionError: null,
  vendorSettingsCollectionPending: false,
  vendorSettingsCollection: undefined,

  saveVendorSettingError: null,
  saveVendorSettingPending: false,
  saveVendorSettingSuccess: null,

  removeVendorLogoError: null,
  removeVendorLogoPending: false,
  removeVendorLogoSuccess: null,

  form: {
    file: null,
    primaryColor: defaultPrimaryColor,
    secondaryColor: defaultSecondaryColor,
    outboundPhoneCall: false,
    inboundPhoneCall: false,
    phoneNumber: '',
    videoConference: false,
  },
  formError: '',
  formSuccess: '',
  formPending: false,
  primaryColor: defaultPrimaryColor,
  secondaryColor: defaultSecondaryColor,
};

export const actions = {
  getVendorSettingCollection: createAction('[Vendor Settings] Get data needed for create / edit vendor setting'),
  getVendorSettingCollectionSuccess: createAction(
    '[Vendor Settings] Data required for vendor setting page after API successfully returns data',
    props<{ vendorSettingsCollection: VendorSettingCollection }>(),
  ),
  getVendorSettingCollectionFailure: createAction(
    '[Vendor Settings] Error in fetching vendor settings collection data',
    props<{ error: any }>(),
  ),
  resetSettingCollection: createAction('[Vendor Settings] Reset Setting Collection'),

  saveVendorSettingsForm: createAction(
    '[VENDOR SETTINGS/API] Set Vendor Settings Form',
    props<{ form: VendorSettingsForm }>(),
  ),
  saveError: createAction('[VENDOR SETTINGS/API] Set Error from Api', props<{ error: any }>()),
  saveFormSuccess: createAction('[VENDOR SETTINGS/API] Set Success from Api', props<{ success: string }>()),
  savePrimaryColor: createAction('[VENDOR SETTINGS/API] Set Primary Color', props<{ color: string }>()),
  saveSecondaryColor: createAction('[VENDOR SETTINGS/API] Set Secondary Color', props<{ color: string }>()),
  removeLogo: createAction('[VENDOR SETTINGS/API] Set Default Logo'),

  saveVendorSetting: createAction(
    '[Vendor Settings] Create / Update Vendor Setting',
    props<{ pageState: SettingPageState; saveVendorSetting: SaveVendorSetting }>(),
  ),
  saveVendorSettingSuccess: createAction(
    '[Vendor Settings] Create / Update Vendor Setting Success',
    props<{ success: any }>(),
  ),
  saveVendorSettingFailure: createAction(
    '[Vendor Settings] Error in creating / updating Vendor Setting',
    props<{ error: any }>(),
  ),

  removeVendorLogo: createAction('[Vendor Settings] Remove Vendor Logo'),
  removeVendorLogoSuccess: createAction('[Vendor Settings] Remove Vendor Logo Success', props<{ success: any }>()),
  removeVendorLogoFailure: createAction('[Vendor Settings] Remove Vendor Logo Error', props<{ error: any }>()),
};

export const reducer = createReducer(
  initialState,
  on(actions.getVendorSettingCollection, state => ({
    ...state,
    vendorSettingsCollectionError: null,
    vendorSettingsCollectionPending: true,
  })),
  on(actions.getVendorSettingCollectionSuccess, (state, { vendorSettingsCollection }) => ({
    ...state,
    vendorSettingsCollectionError: null,
    vendorSettingsCollectionPending: false,
    vendorSettingsCollection,
  })),
  on(actions.getVendorSettingCollectionFailure, (state, { error }) => ({
    ...state,
    vendorSettingsCollectionError: error,
    vendorSettingsCollectionPending: false,
  })),
  on(actions.resetSettingCollection, state => ({
    ...state,
    vendorSettingsCollectionError: null,
    vendorSettingsCollectionPending: false,
    vendorSettingsCollection: undefined,
  })),

  on(actions.saveVendorSettingsForm, (state, { form }) => ({ ...state, form: form, formPending: true })),
  on(actions.saveError, (state, { error }) => ({ ...state, formError: error, formPending: false })),
  on(actions.saveFormSuccess, (state, { success }) => ({
    ...state,
    formSuccess: success,
    formPending: false,
    formError: null,
  })),
  on(actions.savePrimaryColor, (state, { color }) => ({ ...state, primaryColor: color })),
  on(actions.saveSecondaryColor, (state, { color }) => ({ ...state, secondaryColor: color })),

  on(actions.saveVendorSetting, state => ({
    ...state,
    saveVendorSettingError: null,
    saveVendorSettingPending: true,
    saveVendorSettingSuccess: null,
  })),
  on(actions.saveVendorSettingSuccess, (state, { success }) => ({
    ...state,
    saveVendorSettingError: null,
    saveVendorSettingPending: false,
    saveVendorSettingSuccess: success,
  })),
  on(actions.saveVendorSettingFailure, (state, { error }) => ({
    ...state,
    saveVendorSettingError: error,
    saveVendorSettingPending: false,
    saveVendorSettingSuccess: null,
  })),

  on(actions.removeVendorLogo, state => ({
    ...state,
    removeVendorLogoError: null,
    removeVendorLogoPending: true,
    removeVendorLogoSuccess: null,
  })),
  on(actions.removeVendorLogoSuccess, (state, { success }) => ({
    ...state,
    removeVendorLogoError: null,
    removeVendorLogoPending: false,
    removeVendorLogoSuccess: success,
  })),
  on(actions.removeVendorLogoFailure, (state, { error }) => ({
    ...state,
    removeVendorLogoError: error,
    removeVendorLogoPending: false,
    removeVendorLogoSuccess: null,
  })),
);

export const selectSlice = createFeatureSelector<State>(featureKey);

export const selectors = {
  selectVendorSettingsCollectionPending: createSelector(
    selectSlice,
    (state: State) => state.vendorSettingsCollectionPending,
  ),
  selectVendorSettingsCollectionError: createSelector(
    selectSlice,
    (state: State) => state.vendorSettingsCollectionError,
  ),
  selectVendorSettingsCollection: createSelector(selectSlice, (state: State) => state.vendorSettingsCollection),

  selectVendorSettingsForm: createSelector(selectSlice, (state: State) => state.form),
  selectError: createSelector(selectSlice, (state: State) => state.formError),
  selectSuccess: createSelector(selectSlice, (state: State) => state.formSuccess),
  selectPending: createSelector(selectSlice, (state: State) => state.formPending),
  selectPrimaryColor: createSelector(selectSlice, (state: State) => state.primaryColor),
  selectSecondaryColor: createSelector(selectSlice, (state: State) => state.secondaryColor),

  selectSaveVendorSettingPending: createSelector(selectSlice, (state: State) => state.saveVendorSettingPending),
  selectSaveVendorSettingError: createSelector(selectSlice, (state: State) => state.saveVendorSettingError),
  selectSaveVendorSettingSuccess: createSelector(selectSlice, (state: State) => state.saveVendorSettingSuccess),

  selectRemoveVendorLogoPending: createSelector(selectSlice, (state: State) => state.removeVendorLogoPending),
  selectRemoveVendorLogoError: createSelector(selectSlice, (state: State) => state.removeVendorLogoError),
  selectRemoveVendorLogoSuccess: createSelector(selectSlice, (state: State) => state.removeVendorLogoSuccess),
};
