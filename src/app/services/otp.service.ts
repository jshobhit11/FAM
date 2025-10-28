// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';

// @Injectable({
//     providedIn: 'root'
// })
// export class OtpService {
//     private validateOtpUrl = 'http://localhost:8082/validateOtp';

//     constructor(private http: HttpClient) { }

//     validateOtp(phoneNo: string, otp: string): Observable<any> {
//         return this.http.post(`${this.validateOtpUrl}?phoneNo=${phoneNo}&otp=${otp}`, {});
//     }
// }







import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class OtpService {
    private validateOtpUrl = 'http://localhost:8082/api/sms/validate';

    constructor(private http: HttpClient) { }

    validateOtp(phoneNo: string, otp: string): Observable<any> {
        return this.http.post(`${this.validateOtpUrl}?phoneNo=${phoneNo}&otp=${otp}`, {});
    }
}
