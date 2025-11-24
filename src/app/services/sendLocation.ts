import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { UserSessionService } from './user-session.service';

@Injectable({
    providedIn: 'root'
})
export class SendLocationService {

    // Add userSession property (replace UserSessionService with actual type if different)
    constructor(private http: HttpClient, private userSession: UserSessionService) { }

    // private locationBaseUrl = 'http://10.5.10.108:8092/fam/api/location/capture';

    private locationBaseUrl = "http://10.5.100.174:8082/wams/api/locationCapture/saveLocationCaptureData";


    saveLocationCapture(latitude: number, longitude: number, serviceRegistrationsId: string, processTypeName: string): Observable<any> {
        const auth = this.userSession.getAuthDetails();


        // 🔹 Prepare query params
        const params = new HttpParams()
            .set('serviceKey', auth.servicekey)
            .set('apiKey', auth.apikey)
            .set('userCode', auth.usercode)
            .set('userName', auth.username)
            .set('userRole', auth.userrole);

        // 🔹 Body payload
        const body = {
            latitude: latitude.toString(),
            longitude: longitude.toString(),
            serviceRegistrationsId: serviceRegistrationsId,
            processName: processTypeName,
            discom: auth.discom,
            officeId: auth.officeid
        };

        // 🔹 Basic Authentication header
        const username = auth.username;
        const password = auth.password;
        const headers = new HttpHeaders({
            Authorization: 'Basic ' + btoa(`${username}:${password}`),

        });

        console.log('Sending location data to backend:', body);


        return this.http.post(this.locationBaseUrl, body, { params, headers });
    }
}
