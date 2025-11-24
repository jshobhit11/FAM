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
    private validateOtpUrl = 'https://localhost:8443/api/sms/validate';

    // private validateOtpUrl = 'http://hplvmobapp01:8092/fam/api/sms/validate';

    // private validateOtpUrl = 'https://ipdsmobileapps.kdiscoms.org:9200/FAM_APP/api/sms/validate';

    constructor(private http: HttpClient) { }

    validateOtp(phoneNo: string, otp: string): Observable<any> {
        return this.http.post(`${this.validateOtpUrl}?phoneNo=${phoneNo}&otp=${otp}`, {});
    }
}
