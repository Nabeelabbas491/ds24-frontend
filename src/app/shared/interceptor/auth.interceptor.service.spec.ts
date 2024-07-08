import { TestBed } from '@angular/core/testing';
import { AuthInterceptor } from './auth.interceptor.service';
import { HTTP_INTERCEPTORS, HttpRequest } from '@angular/common/http';
import { LocalEnum } from '../common/local.enum';

describe('Auth Interceptor Service', () => {
  let authInterceptor: AuthInterceptor;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthInterceptor, { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }],
    });

    authInterceptor = TestBed.inject(AuthInterceptor);
  });

  it('should be created', () => {
    expect(authInterceptor).toBeTruthy();
  });
  it('should not return an authorization header if authToken is not set in localstorage', () => {
    const mockSetItem = jest.spyOn(Storage.prototype, 'getItem');
    mockSetItem.mockImplementation((key: string) => {
      if (key === LocalEnum.authToken) {
        return null;
      }
      return '';
    });

    const next: any = {
      handle: (responseHandle: any) => {
        return responseHandle;
      },
    };

    const request: HttpRequest<any> = new HttpRequest<any>('GET', `${'/api/some_url'}`);

    const response = authInterceptor.intercept(request, next) as any;

    expect(response.headers.get('Authorization')).toEqual(null);
  });
  it('should return an authorization header if authToken is set in localstorage', () => {
    const authToken: string = 'abc-123-xyz';

    const mockSetItem = jest.spyOn(Storage.prototype, 'getItem');
    mockSetItem.mockImplementation((key: string) => {
      if (key === LocalEnum.authToken) {
        return authToken;
      }
      return '';
    });

    const next: any = {
      handle: (responseHandle: any) => {
        return responseHandle;
      },
    };

    const request: HttpRequest<any> = new HttpRequest<any>('GET', `${'/api/some_url'}`);

    const response = authInterceptor.intercept(request, next) as any;

    expect(response.headers.get('Authorization')).toEqual(`Bearer ${authToken}`);
  });
  it('should not return an authorization header if NO_AUTHORIZATION_HEADER is sent as part of request', () => {
    const authToken: string = 'abc-123-xyz';

    const mockSetItem = jest.spyOn(Storage.prototype, 'getItem');
    mockSetItem.mockImplementation((key: string) => {
      if (key === LocalEnum.authToken) {
        return authToken;
      }
      return '';
    });

    const next: any = {
      handle: (responseHandle: any) => {
        return responseHandle;
      },
    };

    const request: HttpRequest<any> = new HttpRequest<any>('GET', `${'/api/some_url'}`);
    const request_with_no_authentication_header = request.clone({
      headers: request.headers.set('NO_AUTHORIZATION_TOKEN', 'true'),
    });

    const response = authInterceptor.intercept(request_with_no_authentication_header, next) as any;

    expect(response.headers.get('Authorization')).toEqual(null);
  });
});
