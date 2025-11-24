import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SmsRequestDto } from '../models/sms.model';

@Injectable({
    providedIn: 'root'
})

export class SmsLogService {
    checkUserStatus(username: string) {
        throw new Error('Method not implemented.');
    }

    // private checkUserUrl = 'http://localhost:8082/api/smslog/check';
    private sendSmsUrl = 'https://localhost:8443/sendingSMS';
    private checkUserStatusUrl = 'https://localhost:8443/api/smslog/checkUser';
    private checkUserPhoneno = "https://localhost:8443/api/users/byUsername";
    // private validateOtpUrl = 'http://localhost:8082/validate';


    // private sendSmsUrl = 'http://hplvmobapp01:8092/fam/sendingSMS';
    // private checkUserStatusUrl = 'http://hplvmobapp01:8092/fam/api/smslog/checkUser';
    // private checkUserPhoneno = "http://hplvmobapp01:8092/fam/api/users/byUsername";

    // private sendSmsUrl = 'https://ipdsmobileapps.kdiscoms.org:9200/FAM_APP/sendingSMS';
    // private checkUserStatusUrl = 'https://ipdsmobileapps.kdiscoms.org:9200/FAM_APP/api/smslog/checkUser';
    // private checkUserPhoneno = "https://ipdsmobileapps.kdiscoms.org:9200/FAM_APP/api/users/byUsername";

    constructor(private http: HttpClient) { }


    checkUser(username: string): Observable<any> {
        return this.http.get(`${this.checkUserStatusUrl}?username=${username}`);
        // return this.http.get(`${this.checkUserUrl}/${username}`);
    }

    createUser(reqDto: SmsRequestDto): Observable<any> {
        return this.http.post(this.sendSmsUrl, reqDto);
    }

    // checkUserStatus(username: string) {
    //     // return this.http.get<any>(`${this.checkUserStatusUrl}/${username}`);
    //     return this.http.get(`${this.checkUswerStatusUrl}?username=${username}`);
    // }

    // validateOtp(phoneNo: string, otp: string): Observable<any> {
    //     return this.http.post(`${this.validateOtpUrl}?phoneNo=${phoneNo}&otp=${otp}`, {});
    // }

    getUserDetailsByUsername(username: string) {
        return this.http.get(`${this.checkUserPhoneno}?username=${username}`);

    }

}