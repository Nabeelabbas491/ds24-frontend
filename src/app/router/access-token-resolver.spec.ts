import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { accessTokenResolver } from './access-token-resolver';

describe('accessTokenResolver', () => {
  it('should not set cookie if access token exists', () => {
    document.cookie = 'access_token=existingToken';
    const dummyRoute: ActivatedRouteSnapshot = {} as ActivatedRouteSnapshot;
    const dummyState: any = {} as RouterStateSnapshot;
    accessTokenResolver(dummyRoute, dummyState);

    expect(document.cookie).toBe('access_token=existingToken');
  });

  it('should set cookie if access token is missing from cookie and exists in URL', () => {
    Object.defineProperty(document, 'cookie', {
      value: '',
      writable: true,
    });

    Object.defineProperty(window, 'location', {
      value: { href: 'https://example.com?access_token=tokenFromUrl' },
      writable: true,
    });

    const dummyRoute: ActivatedRouteSnapshot = {} as ActivatedRouteSnapshot;
    const dummyState: any = {} as RouterStateSnapshot;
    accessTokenResolver(dummyRoute, dummyState);

    expect(document.cookie).toContain('access_token=tokenFromUrl');
  });

  it('should not set cookie if access token is missing from both cookie and URL', () => {
    Object.defineProperty(document, 'cookie', {
      value: '',
      writable: true,
    });

    Object.defineProperty(window, 'location', {
      value: { href: 'https://example.com' },
      writable: true,
    });

    const dummyRoute: ActivatedRouteSnapshot = {} as ActivatedRouteSnapshot;
    const dummyState: any = {} as RouterStateSnapshot;
    accessTokenResolver(dummyRoute, dummyState);

    expect(document.cookie).toBe('');
  });
});
