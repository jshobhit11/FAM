import { Injectable } from '@angular/core';
import { ApiEndpoint } from './api-endpoint';
import { ApiError } from './types';
import { UserSessionService } from './user-session.service';
import { HttpHeaders, HttpParams, HttpErrorResponse, HttpResponse, HttpClient } from '@angular/common/http';
import { Observable, from, of, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { ApiEndpointForKeyCloak } from './api-endpoint-for-keycloak';

@Injectable({
  providedIn: 'root',
})
export class RestAPIService {
  constructor(private http: HttpClient,protected userSession: UserSessionService) {
    this.afterInit();
  }

  protected afterInit() {}

  protected sendRequest<T>(
    endpoint: ApiEndpoint,
    payload?: Object | FormData | File
  ): Promise<T> {
    return (
      this.userSession
        .getRequestToken()
        //   .then((token) => {
        //     const apiEndPoint = endpoint.getUrl();
        //     if (apiEndPoint === APIUrl.ReclaimLogin || apiEndPoint === APIUrl.Logout) {
        //       return token;
        //     }
        //     return this.userSession.getRequestToken();
        //   })
        .then(() => {
          const headers: Headers = new Headers();
          headers.set(
            'Authorization',
            ['Basic', sessionStorage.getItem('auth-token')].join(' ')
          );
          //   if (token !== null) {
          //     headers.set('Authorization', ['Basic', btoa(`${username}:${password}`)].join(' '));
          //   }

          const requestInit: RequestInit = {
            method: endpoint.getMethod().toString(),
            mode: 'cors',
            redirect: 'follow',
          };

          if (payload !== undefined) {
            if (payload instanceof FormData) {
              requestInit.body = payload;
              headers.delete('Content-Type'); // cannot set this here. it will be set by the browser
            } else if (payload instanceof File) {
              requestInit.body = payload;

              headers.delete('Content-Type');
              headers.set('Content-Type', 'application/octet-stream');
              headers.set('From', payload.name);
            } else {
              headers.set('Content-Type', 'application/json; charset=UTF-8');
              requestInit.body = JSON.stringify(payload);
            }
          }

          requestInit.headers = headers;
          console.log('requestInit', requestInit);

          const theRequest: Request = new Request(
            endpoint.urlString(),
            requestInit
          );

          return fetch(theRequest);
        })
        .then(async (resp) => {
          if (resp.status === 200 || resp.ok) {
            const contentTypeHeaders = resp.headers.get('content-type');
            if (
              contentTypeHeaders &&
              contentTypeHeaders.indexOf('application/json') !== -1
            ) {
              try {
                const json = await resp.json();
                return json;
              } catch (e) {
                return resp;
              }
            }
            return resp;
          }

          let error = resp.statusText;
          let errorCode = resp.status;
          let details = null;

          if (resp.status === 401) {
            this.userSession.authTokenExpirationSubject.next(true);
          }

          try {
            const errorJson = await resp.json();
            console.log('Error from Rest Api Service', errorJson);

            // error = errorJson.error;
            error = errorJson.messageText;
            errorCode = errorJson.errorCode;
            // details = errorJson.errors;
            details = errorJson;
            if (!error && details && details.length) {
              error = details[0].message;
            }
          } catch (e) {}

          const apiError = {
            statusCode: resp.status,
            error,
            errorCode,
            message: resp.statusText,
            isHandledGlobally: false,
            details,
            data: null,
          };
          throw apiError as ApiError;
        })
        .then((responseJSON) => {
          console.log(responseJSON);
          if (responseJSON.error !== undefined) {
            if (responseJSON.statusCode === 401) {
              this.userSession.authTokenExpirationSubject.next(true);
            }

            throw responseJSON as ApiError;
          }

          return responseJSON;
        })
        .catch(() => {
          return false;
        })
    );
  }
  protected sendRequest1<T>(
    endpoint: ApiEndpoint,
    payload?: Object | FormData | File
  ): Promise<T> {
    return (
      this.userSession
        .getRequestToken()
        //   .then((token) => {
        //     const apiEndPoint = endpoint.getUrl();
        //     if (apiEndPoint === APIUrl.ReclaimLogin || apiEndPoint === APIUrl.Logout) {
        //       return token;
        //     }
        //     return this.userSession.getRequestToken();
        //   })
        .then(() => {
          const headers: Headers = new Headers();
          headers.set(
            'Authorization',
            ['Basic', sessionStorage.getItem('auth-token')].join(' ')
          );
          //   if (token !== null) {
          //     headers.set('Authorization', ['Basic', btoa(`${username}:${password}`)].join(' '));
          //   }

          const requestInit: RequestInit = {
            method: endpoint.getMethod().toString(),
            mode: 'cors',
            redirect: 'follow',
          };

          if (payload !== undefined) {
            if (payload instanceof FormData) {
              requestInit.body = payload;
              headers.delete('Content-Type'); // cannot set this here. it will be set by the browser
            } else if (payload instanceof File) {
              requestInit.body = payload;

              headers.delete('Content-Type');
              headers.set('Content-Type', 'application/octet-stream');
              headers.set('From', payload.name);
            } else {
              headers.set('Content-Type', 'application/json; charset=UTF-8');
              requestInit.body = JSON.stringify(payload);
            }
          }

          requestInit.headers = headers;
          console.log('requestInit', requestInit);

          const theRequest: Request = new Request(
            endpoint.urlString(),
            requestInit
          );

          return fetch(theRequest);
        })
        .then(async (resp) => {
          if (resp.status === 200 || resp.ok) {
            const contentTypeHeaders = resp.headers.get('content-type');
            if (
              contentTypeHeaders &&
              contentTypeHeaders.indexOf('application/json') !== -1
            ) {
              try {
                const json = await resp.json();
                return json;
              } catch (e) {
                return resp;
              }
            }
            return resp;
          }

          let error = resp.statusText;
          let errorCode = resp.status;
          let details = null;

          if (resp.status === 401) {
            this.userSession.authTokenExpirationSubject.next(true);
          }

          try {
            const errorJson = await resp.json();
            console.log('Error from Rest Api Service', errorJson);

            // error = errorJson.error;
            error = errorJson.messageText;
            errorCode = errorJson.errorCode;
            // details = errorJson.errors;
            details = errorJson;
            if (!error && details && details.length) {
              error = details[0].message;
            }
          } catch (e) {}

          const apiError = {
            statusCode: resp.status,
            error,
            errorCode,
            message: resp.statusText,
            isHandledGlobally: false,
            details,
            data: null,
          };
          throw apiError as ApiError;
        })
        .then((responseJSON) => {
          console.log(responseJSON);
          if (responseJSON.error !== undefined) {
            if (responseJSON.statusCode === 401) {
              this.userSession.authTokenExpirationSubject.next(true);
            }

            throw responseJSON as ApiError;
          }

          return responseJSON;
        })
        .catch((e) => {
          throw e;
        })
    );
  }

  
  // protected sendRequestBlob<T>(
  //   endpoint: ApiEndpoint,
  //   payload?: Object | FormData | File,
  //   options?: { responseType?: 'blob', observe?: 'response' }
  // ): Observable<HttpResponse<Blob>> {
  //   return new Observable((observer) => {
  //     this.userSession
  //       .getRequestToken()
  //       .then(() => {
  //         // Prepare headers
  //         const headers = new HttpHeaders()
  //           .set('Authorization', 'Basic ' + sessionStorage.getItem('auth-token'));

  //         // Prepare body and headers depending on payload type
  //         let body: any;
  //         if (payload !== undefined) {
  //           if (payload instanceof FormData) {
  //             body = payload;
  //           } else if (payload instanceof File) {
  //             body = payload;
  //             headers.set('Content-Type', 'application/octet-stream');
  //             headers.set('From', payload.name);
  //           } else {
  //             body = JSON.stringify(payload);
  //             headers.set('Content-Type', 'application/json; charset=UTF-8');
  //           }
  //         }

  //         // Prepare options for HttpClient request
  //         const requestOptions = {
  //           headers: headers,
  //           responseType: 'blob' as 'json', // Expecting a Blob response
  //           observe: 'response' as 'response', // We want the full response (including headers)
  //         };

  //         // Make the HTTP request using HttpClient
  //         this.http
  //           .post<HttpResponse<Blob>>(endpoint.urlString(), body, requestOptions)
  //           .subscribe(
  //             (response: HttpResponse<any>) => {
  //               observer.next(response);
  //               observer.complete();
  //             },
  //             (error) => {
  //               observer.error(error);
  //             }
  //           );
  //       })
  //       .catch((error) => {
  //         observer.error(error); // Handle any errors from getRequestToken
  //       });
  //   });
  // }
  protected sendRequestBlob<T>(
    endpoint: ApiEndpoint,
    payload?: Object | FormData | File,
    options?: { responseType?: 'blob', observe?: 'response' }
  ): Observable<HttpResponse<any>> { // Returning HttpResponse with any type to handle both Blob and JSON
    return new Observable((observer) => {
      this.userSession
        .getRequestToken()
        .then(() => {
          const headers = new HttpHeaders().set(
            'Authorization',
            'Basic ' + sessionStorage.getItem('auth-token')
          );
 
          // Prepare body and headers depending on payload type
          let body: any;
          if (payload !== undefined) {
            if (payload instanceof FormData) {
              body = payload;
            } else if (payload instanceof File) {
              body = payload;
              headers.set('Content-Type', 'application/octet-stream');
              headers.set('From', payload.name);
            } else {
              body = JSON.stringify(payload);
              headers.set('Content-Type', 'application/json; charset=UTF-8');
            }
          }
 
          const requestOptions = {
            headers: headers,
            responseType: 'blob' as 'json', // Expecting Blob response by default
            observe: 'response' as 'response',
          };
 
          // Make the HTTP request using HttpClient
          this.http
            .post(endpoint.urlString(), body, requestOptions)
            .subscribe(
              (response: HttpResponse<Blob>) => {
                const contentType = response.headers.get('Content-Type');
                if (contentType && contentType.includes('application/json')) {
                  // Convert Blob to JSON if content type is JSON
                  this.blobToJson(response.body).subscribe(
                    (jsonResponse) => {
                      const jsonResponseObj = new HttpResponse({
                        body: jsonResponse,
                        headers: response.headers,
                        status: response.status,
                        statusText: response.statusText,
                        url: response.url || undefined,
                      });
                      observer.next(jsonResponseObj); // Pass JSON response with headers
                      observer.complete();
                    },
                    (error) => observer.error('Error parsing JSON from Blob')
                  );
                } else {
                  // Return Blob response directly
                  observer.next(response); // Pass Blob response with headers
                  observer.complete();
                }
              },
              (error) => observer.error(error)
            );
        })
        .catch((error) => observer.error(error));
    });
  }

  uploadFile(url: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
 
    return this.http.post(url, formData, { responseType: 'blob', observe: 'response' })
      .pipe(
        switchMap(response => {
          const contentType = response.headers.get('Content-Type');
          if (contentType && contentType.includes('application/json')) {
            // If JSON, parse the Blob as JSON
            return this.blobToJson(response.body as Blob);
          }
          return of(response.body); // Treat as Blob if not JSON
        }),
        catchError(error => {
          console.error('Error uploading file:', error);
          return of(null); // Handle error appropriately
        })
      );
  }

  private blobToJson(blob: Blob): Observable<any> {
    return new Observable(observer => {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          observer.next(JSON.parse(reader.result as string));
          observer.complete();
        } catch (error) {
          observer.error('Error parsing JSON');
        }
      };
      reader.onerror = () => observer.error('Error reading Blob');
      reader.readAsText(blob);
    });
  }

  protected sendRequestForKeyCloak<T>(endpoint: ApiEndpointForKeyCloak, payload?: Object | FormData | File): Promise<T> {
    return this.userSession
      .getRequestToken()
      .then(async () => {
        const headers: Headers = new Headers();
       //Production
        //headers.set('Authorization', ['Basic', btoa('KDISCOMS_MOB_APPS_FAM:UXSpWsHjNsD1J53BwNAYVM0uf6nzlLUf')].join(' '));
        //Testing
       headers.set('Authorization', ['Basic', btoa('BESCOM_MOBILE_APPS:R08On2SaLM4LPH228q7alKZJSpGbuWkV')].join(' '));
        const requestInit: RequestInit = {
          method: endpoint.getMethod().toString(),
          mode: 'cors',
          redirect: 'follow',
        };

        if (payload !== undefined) {
          if (payload instanceof FormData) {
            requestInit.body = payload;
            headers.delete('Content-Type'); // cannot set this here. it will be set by the browser
          } else if (payload instanceof File) {
            requestInit.body = payload;

            headers.delete('Content-Type');
            headers.set('Content-Type', 'application/octet-stream');
            headers.set('From', payload.name);
          } else {
            headers.set('Content-Type', 'application/json; charset=UTF-8');
            requestInit.body = JSON.stringify(payload);
          }
        } else {
          headers.append('Content-Type', 'application/x-www-form-urlencoded');

          const formData = new URLSearchParams();
          formData.append('grant_type', 'password');
          formData.append('username', await sessionStorage.getItem('key-cloak-user'));
          formData.append('password', await sessionStorage.getItem('key-cloak-password'));
          requestInit.body = formData.toString();
        }
        requestInit.headers = headers;
        console.log('requestInit', requestInit);

        const theRequest: Request = new Request(endpoint.urlString(), requestInit);

        return fetch(theRequest);
      })
      .then(async (resp) => {
        if (resp.status === 200 || resp.ok) {
          const contentTypeHeaders = resp.headers.get('content-type');
          if (contentTypeHeaders && contentTypeHeaders.indexOf('application/json') !== -1) {
            try {
              const json = await resp.json();
              return json;
            } catch (e) {
              return resp;
            }
          }
          return resp;
        }

        let error = resp.statusText;
        let errorCode = resp.status;
        let details = null;

        if (resp.status === 401) {
          this.userSession.authTokenExpirationSubject.next(true);
        }

        try {
          const errorJson = await resp.json();
          console.log('Error from Rest Api Service', errorJson);

          // error = errorJson.error;
          error = errorJson.error_description;
          // errorCode = errorJson.errorCode;
          // details = errorJson.errors;
          details = errorJson;
          if (!error && details && details.length) {
            error = details[0].message;
          }
        } catch (e) {}

        const apiError = {
          statusCode: resp.status,
          error,
          errorCode,
          message: resp.statusText,
          isHandledGlobally: false,
          details,
          data: null,
        };
        throw apiError as ApiError;
      })
      .then((responseJSON) => {
        console.log(responseJSON);
        if (responseJSON.error !== undefined) {
          if (responseJSON.statusCode === 401) {
            this.userSession.authTokenExpirationSubject.next(true);
          }

          throw responseJSON as ApiError;
        }

        return responseJSON;
      })
      .catch((e) => {
        throw e;
      });
  }
}
