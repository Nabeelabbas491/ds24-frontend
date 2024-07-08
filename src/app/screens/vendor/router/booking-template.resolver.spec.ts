import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { bookingTemplateResolver } from './booking-template.resolver';

describe('bookingTemplateResolver', () => {
  const executeResolver: ResolveFn<void> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() => bookingTemplateResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
