import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CommonService } from './common.service';
// import { SpinnerOverlayService } from '../components/spinner-overlay/spinner-overlay.service';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private baseUrl = environment.baseURL;

  constructor(
    private http: HttpClient,
    private commonService: CommonService, // private spinnerService: SpinnerOverlayService
  ) {}

  get(url: string, params?: any): Observable<any> {
    return this.http.get(this.baseUrl + url, { params: params }).pipe(catchError(this.errorHandler.bind(this)));
  }

  post(url: string, payload: any): Observable<any> {
    return this.http.post(this.baseUrl + url, payload).pipe(catchError(this.errorHandler.bind(this)));
  }

  put(url: string, payload: any): Observable<any> {
    return this.http.put(this.baseUrl + url, payload).pipe(catchError(this.errorHandler.bind(this)));
  }

  delete(url: string): Observable<any> {
    return this.http.delete(this.baseUrl + url).pipe(catchError(this.errorHandler.bind(this)));
  }

  getParams(parameters: any) {
    let params = new HttpParams();
    Object.keys(parameters).map((key) => {
      params = params.set(key, parameters[key]);
    });
    return params;
  }

  private errorHandler(response: any) {
    const error = response.error;
    const keys = Object.keys(error);
    const key = keys[0];
    let message = error[key];
    if (response.status === 401) {
      // auth token delete
      // redirect login page
    }
    if (error[key] instanceof Array) {
      message = error[key][0];
    }
    if (key === 'isTrusted') {
      // this will occur when not connected to internet
    } else {
      message = key + ' : ' + message;
    }
    // call snackbar and show error with message
    this.commonService.showSnackBar(error.message || 'Oops something went wrong!');
    // this.spinnerService.hide();
    return throwError({ messages: message, error });
  }
}
