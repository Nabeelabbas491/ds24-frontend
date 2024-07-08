import { Injectable } from '@angular/core';
import { SaveVendorSetting, VendorSetting } from '../types/vendor-settings.type';
import { Observable, catchError, map, of, throwError } from 'rxjs';
import { environment } from './../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { GenericResponse } from '../types/misc.type';
import { buildSettingFormData, getErrorMessage } from '../shared/common/util';

@Injectable({
  providedIn: 'root',
})
export class VendorSettingsService {
  private env = environment;
  constructor(private httpClient: HttpClient) {}

  createVendorSetting(vendorSetting: SaveVendorSetting): Observable<GenericResponse<any>> {
    const formData: FormData = buildSettingFormData(vendorSetting);

    return this.httpClient.post<GenericResponse<any>>(`${this.env.apiUrl}/setting/create`, formData).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => getErrorMessage(error));
      }),
    );
  }
  updateVendorSetting(vendorSetting: SaveVendorSetting): Observable<GenericResponse<any>> {
    const formData: FormData = buildSettingFormData(vendorSetting);

    return this.httpClient.post<GenericResponse<any>>(`${this.env.apiUrl}/setting/update`, formData).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => getErrorMessage(error));
      }),
    );
  }
  removeLogo(): Observable<GenericResponse<any>> {
    return this.httpClient.post<GenericResponse<any>>(`${this.env.apiUrl}/setting/remove-logo`, {}).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => getErrorMessage(error));
      }),
    );
  }

  getVendorSettings(): Observable<VendorSetting | null> {
    return this.httpClient.get<GenericResponse<VendorSetting>>(`${this.env.apiUrl}/setting`).pipe(
      map(x => x.data),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404) {
          return of(null);
        }
        return throwError(() => getErrorMessage(error));
      }),
    );
  }
}
