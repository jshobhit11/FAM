// document.service.ts
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserSessionService } from './user-session.service';
declare var FileTransfer: any;
declare var FileUploadOptions: any;

@Injectable({ providedIn: 'root' })
export class ImageDocumentService {
    //private baseUrl = 'http://localhost:8195/api/documentUpload/storeDocumentFile';
    // private baseUrl = 'http://10.5.100.174:8082/wams/api/documentUpload/storeDocumentFile?apiKey=ss01Agh0639&serviceKey=ss01gbtr&userCode=A45123ET2&userName=AE_FRAZERTOWN&userRole=ROLE_AE&documentName=Building%20Photo&documentTypeId=161&documentReferenceNumber=est4594848048&serviceRegisterationsId=7727249&processName=Estimation%20Forms'
    // private baseUrl = 'http://10.5.100.174:8082/wams/api/documentUpload/storeDocumentFile'

    private baseUrl = "https://ipdsmobileapps.kdiscoms.org:9200/WAMS_TEST_SERVICES/api/documentUpload/storeDocumentFile";

    // private locationBaseUrl = "http://localhost:8193/api/locationCapture/saveLocationCaptureData";
    //private locationBaseUrl = "http://10.5.100.174:8082/wams/api/locationCapture/saveLocationCaptureData";
    constructor(private http: HttpClient, private userSession: UserSessionService) { }

    // uploadFile(file: File) {
    //     //old way 
    //     // const params = new URLSearchParams({
    //     //     apiKey: 'ss01Agh0639',
    //     //     serviceKey: 'ss01gbtr',
    //     //     userCode: 'A45123ET2',
    //     //     userName: 'AE_FRAZERTOWN',
    //     //     userRole: 'ROLE_AE',
    //     //     documentName: file.name,
    //     //     documentTypeId: '161',
    //     //     documentReferenceNumber: 'est4594848048',
    //     //     serviceRegisterationsId: '7727249',
    //     //     processName: 'Estimation Forms',
    //     // });

    //     //new way
    //     const params = new HttpParams()
    //         .set('apiKey', 'ss01Agh0639')
    //         .set('serviceKey', 'ss01gbtr')
    //         .set('userCode', 'A45123ET2')
    //         .set('userName', 'AE_FRAZERTOWN')
    //         .set('userRole', 'ROLE_AE')
    //         .set('documentName', file.name)
    //         .set('documentTypeId', '161')
    //         .set('documentReferenceNumber', 'est4594848048')
    //         .set('serviceRegisterationsId', '7727249')
    //         .set('processName', 'Estimation Forms');

    //     const formData = new FormData();
    //     formData.append('documentFile', file);

    //     // const headers = new HttpHeaders({
    //     //     Authorization: 'AE_FRAZERTOWN' + 'test'
    //     // });

    //     // const header = new HttpHeaders({
    //     //     Authoization: 'AE_FRAZERTOWN' + 'test'
    //     // });

    //     //  return this.http.post(`${this.baseUrl}`, formData);
    //     // return this.http.post(this.baseUrl, formData, { params });

    //     const username = 'AE_FRAZERTOWN';
    //     const password = 'test';
    //     const header = new HttpHeaders({
    //         Authorization: 'Basic ' + btoa(`${username}:${password}`)
    //     });

    //     return this.http.post(this.baseUrl, formData, { params, headers: header });
    // }



    uploadFile(fileUri: string, serviceRegistrationsId: any, processTypeName: string): Promise<any> {
        const auth = this.userSession.getAuthDetails();
        return new Promise((resolve, reject) => {


            const fileName = fileUri.substring(fileUri.lastIndexOf('/') + 1);
            const options = new FileUploadOptions();
            options.fileKey = 'documentFile';
            options.fileName = fileName;
            options.mimeType = 'image/jpeg';



            // All required params for your backend API
            options.params = {
                apiKey: auth.apikey,
                serviceKey: auth.servicekey,
                userCode: auth.usercode,
                userName: auth.username,
                userRole: auth.userrole,
                documentName: "Site_INSPECTION_BUILDING_PHOTO",
                documentTypeId: '161',
                documentReferenceNumber: 'est4594848048',
                serviceRegisterationsId: serviceRegistrationsId,
                processName: processTypeName
            };

            // Add basic auth header
            const username = auth.username;
            const password = auth.password;
            options.headers = {
                Authorization: 'Basic ' + btoa(`${username}:${password}`)
            };

            // Cordova FileTransfer upload
            const ft = new FileTransfer();
            ft.upload(
                fileUri,
                encodeURI(this.baseUrl),
                (result: any) => {
                    console.log('Upload success:', result);
                    resolve(result);
                },
                (error: any) => {
                    console.error('Upload error:', error);
                    reject(error);
                },
                options
            );
        });
    }


    // saveLocationCapture(latitude: number, longitude: number) {
    //     const url =
    //         'http://localhost:8193/api/locationCapture/saveLocationCaptureData' +
    //         '?serviceKey=ss01gbtr' +
    //         '&apiKey=ss01Agh0639' +
    //         '&userCode=A45123ET2' +
    //         '&userName=AE_FRAZERTOWN' +
    //         '&userRole=ROLE_AE';

    //     const body = {
    //         latitude: latitude.toString(),
    //         longitude: longitude.toString(),
    //         serviceRegistrationsId: '7727250',
    //         processName: 'Estimation Forms',
    //         discom: '1',
    //         officeId: '150030'
    //     };

    //     return this.http.post(url, body);
    // }

    // saveLocationCapture(latitude: number, longitude: number) {
    //     const params = new HttpParams()
    //         .set('serviceKey', 'ss01gbtr')
    //         .set('apiKey', 'ss01Agh0639')
    //         .set('userCode', 'A45123ET2')
    //         .set('userName', 'AE_FRAZERTOWN')
    //         .set('userRole', 'ROLE_AE');

    //     const body = {
    //         latitude: latitude.toString(),
    //         longitude: longitude.toString(),
    //         serviceRegistrationsId: '7727250',
    //         processName: 'Estimation Forms',
    //         discom: '1',
    //         officeId: '150030'
    //     };

    //     // ✅ Add Basic Auth header
    //     const username = 'AE_FRAZERTOWN';
    //     const password = 'test';
    //     const headers = new HttpHeaders({
    //         Authorization: 'Basic ' + btoa(`${username}:${password}`)
    //     });

    //     console.log('📍 Sending location data:', body);



    //     // ✅ Include headers and params in the POST request
    //     return this.http.post(this.locationBaseUrl, body, { params, headers });

    //     //  return this.http.post(this.locationBaseUrl, body, { params });
    // }
}


