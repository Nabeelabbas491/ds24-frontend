import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { getCookie } from '../shared/common/util';

export const accessTokenResolver: ResolveFn<void> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const token = getCookie('access_token');

  if (!token && state && route && location.href.includes('access_token=')) {
    document.cookie = `access_token=${
      location.href.split('access_token=')[1]
    }; path=/; expires=Fri, 31 Dec 9999 23:59:59 GMT; SameSite=None; Secure; Expires=`;
  }
};
