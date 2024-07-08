import { SaveVendorSetting, VendorSettingCollection, VendorSettingsForm } from '../../types/vendor-settings.type';
import { State, initialState, reducer, selectors } from './vendor-settings.store';
import { actions } from './vendor-settings.store';

describe('Vendor Settigs Reducer', () => {
  it('should handle save form action', () => {
    const form: VendorSettingsForm = {
      file: null,
      primaryColor: '#A1B2C3',
      secondaryColor: '#D4E5F6',
      outboundPhoneCall: true,
      inboundPhoneCall: true,
      phoneNumber: '12345',
      videoConference: true,
    };
    const action = actions.saveVendorSettingsForm({ form });
    const state = reducer(initialState, action);
    expect(state.form).toEqual(form);
  });

  it('should handle form Error action', () => {
    const error = 'Invalid form';
    const action = actions.saveError({ error });
    const state = reducer(initialState, action);
    expect(state.formError).toBe(error);
  });

  it('should handle form success action', () => {
    const success = 'form saved successfully';
    const action = actions.saveFormSuccess({ success });
    const state = reducer(initialState, action);
    expect(state.formSuccess).toBe(success);
  });

  it('should handle save primary color action', () => {
    const color = '#A1B2C3';
    const action = actions.savePrimaryColor({ color });
    const state = reducer(initialState, action);
    expect(state.primaryColor).toBe(color);
  });

  it('should handle save secondary color action', () => {
    const color = '#D4E5F6';
    const action = actions.saveSecondaryColor({ color });
    const state = reducer(initialState, action);
    expect(state.secondaryColor).toBe(color);
  });

  it('should handle getVendorSettingCollection action', () => {
    const state: State = {
      ...initialState,
      vendorSettingsCollection: undefined,
      vendorSettingsCollectionError: null,
      vendorSettingsCollectionPending: false,
    };
    const newState = reducer(state, actions.getVendorSettingCollection());

    expect(newState.vendorSettingsCollection).toEqual(undefined);
    expect(newState.vendorSettingsCollectionError).toEqual(null);
    expect(newState.vendorSettingsCollectionPending).toEqual(true);
  });

  it('should handle getVendorSettingCollectionSuccess action', () => {
    const vendorSettingsCollection: VendorSettingCollection = {
      meetingTypes: [],
      vendorSetting: {
        id: 1,
        logo: '',
        primaryColor: '#000000',
        secondaryColor: '#ff00ff',
        phoneNumber: '123-456',
        meetingTypes: [
          { id: 1, name: 'Inbound Call' },
          { id: 2, name: 'Outbound Call' },
        ],
      },
      pageState: 'edit',
    };
    const state: State = {
      ...initialState,
      vendorSettingsCollection: undefined,
      vendorSettingsCollectionError: null,
      vendorSettingsCollectionPending: true,
    };
    const newState = reducer(state, actions.getVendorSettingCollectionSuccess({ vendorSettingsCollection }));

    expect(newState.vendorSettingsCollection).toEqual(vendorSettingsCollection);
    expect(newState.vendorSettingsCollectionError).toEqual(null);
    expect(newState.vendorSettingsCollectionPending).toEqual(false);
  });

  it('should handle getVendorSettingCollectionFailure action', () => {
    const errorMessage = 'Some Error Occured!';
    const state: State = {
      ...initialState,
      vendorSettingsCollection: undefined,
      vendorSettingsCollectionError: null,
      vendorSettingsCollectionPending: false,
    };
    const newState = reducer(state, actions.getVendorSettingCollectionFailure({ error: errorMessage }));

    expect(newState.vendorSettingsCollection).toEqual(undefined);
    expect(newState.vendorSettingsCollectionError).toEqual(errorMessage);
    expect(newState.vendorSettingsCollectionPending).toEqual(false);
  });
  it('should handle resetSettingCollection action', () => {
    const vendorSettingsCollection: VendorSettingCollection = {
      meetingTypes: [],
      vendorSetting: {
        id: 2,
        logo: '',
        primaryColor: '#abcdef',
        secondaryColor: '#00ffff',
        phoneNumber: '123-456',
        meetingTypes: [
          { id: 1, name: 'Inbound Call' },
          { id: 2, name: 'Outbound Call' },
          { id: 3, name: 'Zoom Meeting' },
        ],
      },
      pageState: 'edit',
    };

    const state: State = {
      ...initialState,
      vendorSettingsCollection: vendorSettingsCollection,
      vendorSettingsCollectionError: null,
      vendorSettingsCollectionPending: false,
    };
    const newState = reducer(state, actions.resetSettingCollection());

    expect(newState.vendorSettingsCollection).toEqual(undefined);
    expect(newState.vendorSettingsCollectionError).toEqual(null);
    expect(newState.vendorSettingsCollectionPending).toEqual(false);
  });

  it('should handle saveVendorSetting action', () => {
    const saveVendorSetting: SaveVendorSetting = {
      logo: undefined,
      primaryColor: '#000000',
      secondaryColor: '#ff00ff',
      phoneNumber: '123-456',
      meetingTypes: [1, 2],
    };
    const state: State = {
      ...initialState,
      saveVendorSettingSuccess: null,
      saveVendorSettingError: null,
      saveVendorSettingPending: false,
    };
    const newState = reducer(state, actions.saveVendorSetting({ pageState: 'create', saveVendorSetting }));

    expect(newState.saveVendorSettingSuccess).toEqual(null);
    expect(newState.saveVendorSettingError).toEqual(null);
    expect(newState.saveVendorSettingPending).toEqual(true);
  });
  it('should handle saveVendorSettingSuccess action', () => {
    const successMsg: string = 'Vendor Setting Saved Successfully';
    const state: State = {
      ...initialState,
      saveVendorSettingSuccess: null,
      saveVendorSettingError: null,
      saveVendorSettingPending: false,
    };
    const newState = reducer(state, actions.saveVendorSettingSuccess({ success: successMsg }));

    expect(newState.saveVendorSettingSuccess).toEqual(successMsg);
    expect(newState.saveVendorSettingError).toEqual(null);
    expect(newState.saveVendorSettingPending).toEqual(false);
  });
  it('should handle saveVendorSettingFailure action', () => {
    const errorMessage = 'Some Error Occured!';
    const state: State = {
      ...initialState,
      saveVendorSettingSuccess: null,
      saveVendorSettingError: null,
      saveVendorSettingPending: false,
    };
    const newState = reducer(state, actions.saveVendorSettingFailure({ error: errorMessage }));

    expect(newState.saveVendorSettingSuccess).toEqual(null);
    expect(newState.saveVendorSettingError).toEqual(errorMessage);
    expect(newState.saveVendorSettingPending).toEqual(false);
  });

  it('should handle removeVendorLogo action', () => {
    const state: State = {
      ...initialState,
      removeVendorLogoSuccess: null,
      removeVendorLogoError: null,
      removeVendorLogoPending: false,
    };
    const newState = reducer(state, actions.removeVendorLogo());

    expect(newState.removeVendorLogoSuccess).toEqual(null);
    expect(newState.removeVendorLogoError).toEqual(null);
    expect(newState.removeVendorLogoPending).toEqual(true);
  });
  it('should handle removeVendorLogoSuccess action', () => {
    const successMsg: string = 'Logo Removed Successfully';
    const state: State = {
      ...initialState,
      removeVendorLogoSuccess: null,
      removeVendorLogoError: null,
      removeVendorLogoPending: false,
    };
    const newState = reducer(state, actions.removeVendorLogoSuccess({ success: successMsg }));

    expect(newState.removeVendorLogoSuccess).toEqual(successMsg);
    expect(newState.removeVendorLogoError).toEqual(null);
    expect(newState.removeVendorLogoPending).toEqual(false);
  });
  it('should handle removeVendorLogoFailure action', () => {
    const errorMessage = 'Some Error Occured!';
    const state: State = {
      ...initialState,
      removeVendorLogoSuccess: null,
      removeVendorLogoError: null,
      removeVendorLogoPending: false,
    };
    const newState = reducer(state, actions.removeVendorLogoFailure({ error: errorMessage }));

    expect(newState.removeVendorLogoSuccess).toEqual(null);
    expect(newState.removeVendorLogoError).toEqual(errorMessage);
    expect(newState.removeVendorLogoPending).toEqual(false);
  });
});

describe('Vendor Settings Selectors', () => {
  it('should select form', () => {
    const selectedValue = selectors.selectVendorSettingsForm.projector(initialState);
    expect(selectedValue).toEqual(initialState.form);
  });

  it('should select form success', () => {
    const selectedValue = selectors.selectSuccess.projector(initialState);
    expect(selectedValue).toBe(initialState.formSuccess);
  });

  it('should slect form error', () => {
    const selectedValue = selectors.selectError.projector(initialState);
    expect(selectedValue).toBe(initialState.formError);
  });

  it('should select primary color', () => {
    const selectedValue = selectors.selectPrimaryColor.projector(initialState);
    expect(selectedValue).toBe(initialState.primaryColor);
  });

  it('should select secondary color', () => {
    const selectedValue = selectors.selectSecondaryColor.projector(initialState);
    expect(selectedValue).toBe(initialState.secondaryColor);
  });

  it('should select vendorSettingsCollection', () => {
    const selectedValue = selectors.selectVendorSettingsCollection.projector(initialState);
    expect(selectedValue).toEqual(initialState.vendorSettingsCollection);
  });
  it('should select vendorSettingsCollectionError', () => {
    const selectedValue = selectors.selectVendorSettingsCollectionError.projector(initialState);
    expect(selectedValue).toEqual(initialState.vendorSettingsCollectionError);
  });
  it('should select vendorSettingsCollectionPending', () => {
    const selectedValue = selectors.selectVendorSettingsCollectionPending.projector(initialState);
    expect(selectedValue).toEqual(initialState.vendorSettingsCollectionPending);
  });

  it('should select selectSaveVendorSettingSuccess', () => {
    const selectedValue = selectors.selectSaveVendorSettingSuccess.projector(initialState);
    expect(selectedValue).toEqual(initialState.saveVendorSettingSuccess);
  });
  it('should select selectSaveVendorSettingError', () => {
    const selectedValue = selectors.selectSaveVendorSettingError.projector(initialState);
    expect(selectedValue).toEqual(initialState.saveVendorSettingError);
  });
  it('should select selectSaveVendorSettingPending', () => {
    const selectedValue = selectors.selectSaveVendorSettingPending.projector(initialState);
    expect(selectedValue).toEqual(initialState.saveVendorSettingPending);
  });

  it('should select selectRemoveVendorLogoPending', () => {
    const selectedValue = selectors.selectRemoveVendorLogoPending.projector(initialState);
    expect(selectedValue).toEqual(initialState.removeVendorLogoPending);
  });
  it('should select selectRemoveVendorLogoError', () => {
    const selectedValue = selectors.selectRemoveVendorLogoError.projector(initialState);
    expect(selectedValue).toEqual(initialState.removeVendorLogoError);
  });
  it('should select selectRemoveVendorLogoSuccess', () => {
    const selectedValue = selectors.selectRemoveVendorLogoSuccess.projector(initialState);
    expect(selectedValue).toEqual(initialState.removeVendorLogoSuccess);
  });
});
