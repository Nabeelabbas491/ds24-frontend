import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { GenericResponse } from '../types/misc.type';
import { environment } from './../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { NO_AUTHORIZATION_HEADER, getErrorMessage, getIntegrationInfo } from '../shared/common/util';
import { GoogleAuthUrl } from '../types/google-integration.type';

@Injectable()
export class GoogleIntegrationService {
  private env = environment;
  public popup: Window | null = null;

  constructor(private httpClient: HttpClient) {}
  getAuthenticationUrl(): Observable<GoogleAuthUrl> {
    return this.httpClient
      .get<GenericResponse<GoogleAuthUrl>>(`${this.env.apiUrl}/google/auth`, NO_AUTHORIZATION_HEADER)
      .pipe(
        map(x => {
          return x.data;
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => getErrorMessage(error));
        }),
      );
  }
  googleConnect(code: string): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('code', code);
    return this.httpClient.post<GenericResponse<any>>(`${this.env.apiUrl}/google/connect`, formData).pipe(
      map(x => {
        return x.data;
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      }),
    );
  }
  googleDisconnect(): Observable<any> {
    return this.httpClient.post<GenericResponse<any>>(`${this.env.apiUrl}/google/disconnect`, {}).pipe(
      map(x => {
        return x.data;
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => getErrorMessage(error));
      }),
    );
  }
  googleCalendarClient(bookingProductId: string, code: string): Observable<any> {
    const codeObj = {
      googleAuthorizationCode: code,
    };
    return this.httpClient
      .post<GenericResponse<any>>(`${this.env.apiUrl}/appointments/${bookingProductId}/client-google-calendar`, codeObj)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => getErrorMessage(error));
        }),
      );
  }

  syncVendorAppointment(): Observable<string> {
    const integrationInfo = getIntegrationInfo();
    const appointmentId = parseInt(integrationInfo?.appointmentId as string);

    return this.httpClient
      .post<GenericResponse<any>>(`${this.env.apiUrl}/appointments/${appointmentId}/google-calendar`, {})
      .pipe(
        map(response => response.message),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => getErrorMessage(error));
        }),
      );
  }
}
