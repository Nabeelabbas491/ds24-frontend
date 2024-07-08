import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';
import { cold, hot } from 'jasmine-marbles';
import { actions } from '../store';
import { provideMockStore } from '@ngrx/store/testing';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { VendorSettingsEffects } from './vendor-settings.effects';
import { VendorService } from '../services/vendor.service';
import { VendorSettingsService } from '../services/vendor-settings.service';
import { SettingPageState } from '../types/misc.type';
import { SaveVendorSetting, VendorSettingCollection } from '../types/vendor-settings.type';

describe('VendorSettingsEffects', () => {
  let effects: VendorSettingsEffects;
  let vendorService: VendorService;
  let vendorSettingsService: VendorSettingsService;

  let actions$: Observable<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        VendorSettingsEffects,
        VendorService,
        VendorSettingsService,
        {
          provide: vendorService,
          useValue: {
            getVendorSettingCollection: jest.fn(),
          },
        },
        {
          provide: vendorSettingsService,
          useValue: {
            createVendorSetting: jest.fn(),
            updateVendorSetting: jest.fn(),
            getVendorSettings: jest.fn(),
            removeVendorLogo: jest.fn(),
          },
        },
        provideMockActions(() => actions$),
        provideMockStore({
          selectors: [],
        }),
      ],
      imports: [HttpClientModule, TranslateModule.forRoot()],
    });

    effects = TestBed.inject(VendorSettingsEffects);
    vendorService = TestBed.inject(VendorService);
    vendorSettingsService = TestBed.inject(VendorSettingsService);
    actions$ = TestBed.inject(Actions);
  });

  describe('saveVendorSetting$', () => {
    it('should return an vendorSettings.saveVendorSettingSuccess action, when vendor settings are saved successfully', () => {
      const pageState: SettingPageState = 'create';
      const saveVendorSetting: SaveVendorSetting = {
        logo: undefined,
        primaryColor: '#000000',
        secondaryColor: '#ffffff',
        phoneNumber: '123-456',
        meetingTypes: [1, 2],
      };
      const vendorSaveSuccess = {
        response: 'vendor setting saved successfully',
      };

      const action = actions.vendorSettings.saveVendorSetting({ pageState, saveVendorSetting });
      const completion = actions.vendorSettings.saveVendorSettingSuccess({ success: undefined });

      actions$ = hot('-a', { a: action });
      const response = cold('-a', { a: vendorSaveSuccess });
      const expected = cold('--b', { b: completion });
      vendorSettingsService.createVendorSetting = jest.fn(() => response);

      expect(effects.saveVendorSetting$).toBeObservable(expected);
    });
  });

  describe('removeVendorLogo$', () => {
    it('should return an vendorSettings.saveVendorSettingSuccess action, when vendor settings are saved successfully', () => {
      const removeVendorLogoSuccess = {
        response: 'vendor logo removed successfully',
      };

      const action = actions.vendorSettings.removeVendorLogo();
      const completion = actions.vendorSettings.removeVendorLogoSuccess({ success: undefined });

      actions$ = hot('-a', { a: action });
      const response = cold('-a', { a: removeVendorLogoSuccess });
      const expected = cold('--b', { b: completion });
      vendorSettingsService.removeLogo = jest.fn(() => response);

      expect(effects.removeVendorLogo$).toBeObservable(expected);
    });
  });

  describe('getVendorSettingsCollection$', () => {
    it('should return an vendorSettings.getVendorSettingCollectionSuccess action, when vendor settings are retrieved successfully', () => {
      const vendorSettingsCollection: VendorSettingCollection = {
        meetingTypes: [
          { id: 1, name: 'inbound call' },
          { id: 2, name: 'outbound call' },
          { id: 3, name: 'zoom call' },
        ],
        vendorSetting: {
          id: 1,
          logo: '',
          primaryColor: '#000000',
          secondaryColor: '#ffffff',
          phoneNumber: '123-456',
          meetingTypes: [
            { id: 1, name: 'inbound call' },
            { id: 2, name: 'outbound call' },
            { id: 3, name: 'zoom call' },
          ],
        },
        pageState: 'edit',
      };

      const action = actions.vendorSettings.getVendorSettingCollection();
      const completion = actions.vendorSettings.getVendorSettingCollectionSuccess({ vendorSettingsCollection });

      actions$ = hot('-a', { a: action });
      const response = cold('-a', { a: vendorSettingsCollection });
      const expected = cold('--b', { b: completion });
      vendorService.getVendorSettingCollection = jest.fn(() => response);

      expect(effects.getVendorSettingsCollection$).toBeObservable(expected);
    });
  });
});
