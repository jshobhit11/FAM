import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SmsRequestDto } from '../models/sms.model';

@Injectable({
    providedIn: 'root'
})

export class SmsLogService {

    private checkUserUrl = 'http://localhost:8082/api/smslog/check';
    private sendSmsUrl = 'http://localhost:8082/sendingSMS';
    // private validateOtpUrl = 'http://localhost:8082/validate';

    constructor(private http: HttpClient) { }


    checkUsername(username: string): Observable<any> {
        return this.http.get(`${this.checkUserUrl}?username=${username}`);
        // return this.http.get(`${this.checkUserUrl}/${username}`);
    }

    createUser(reqDto: SmsRequestDto): Observable<any> {
        return this.http.post(this.sendSmsUrl, reqDto);
    }

    // validateOtp(phoneNo: string, otp: string): Observable<any> {
    //     return this.http.post(`${this.validateOtpUrl}?phoneNo=${phoneNo}&otp=${otp}`, {});
    // }

}