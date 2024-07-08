import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';
import { GenericResponse } from '../types/misc.type';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, map, catchError, throwError } from 'rxjs';
import { NO_AUTHORIZATION_HEADER, getErrorMessage } from '../shared/common/util';
import { TimeZone } from '../types/timezone.type';

@Injectable({
  providedIn: 'root',
})
export class TimezoneService {
  private env = environment;

  constructor(private httpClient: HttpClient) {}

  getTimezones(): Observable<TimeZone[]> {
    return this.httpClient
      .get<GenericResponse<TimeZone[]>>(`${this.env.apiUrl}/timezones`, NO_AUTHORIZATION_HEADER)
      .pipe(
        map((response: any) => response.data.timeZones),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => getErrorMessage(error));
        }),
      );
  }
}
