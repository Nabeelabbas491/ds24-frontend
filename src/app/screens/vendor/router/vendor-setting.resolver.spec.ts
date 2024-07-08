import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { vendorSettingsResolver } from './vendor-setting.resolver';

describe('vendorSettingResolver', () => {
  const executeResolver: ResolveFn<void> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() => vendorSettingsResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
