import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
    providedIn: 'root'
})


export class VersionService {

    private apiUrl = 'https://localhost:8443/api/version/check';
    // private apiUrl = "http://10.5.10.108:8092/fam/api/version/check";
    // private apiUrl = "http://ipdsmobileapps.kdiscoms.org:9200/WAMS_TEST_SERVICES/api/version/check";

    //private apiUrl = "http://hplvmobapp01:8092/fam/api/version/check";

    // private apiUrl = 'https://ipdsmobileapps.kdiscoms.org:9200/FAM_APP/api/version/check';

    constructor(private http: HttpClient) { }

    validateApp(appCode: number, version: number): Observable<any> {
        return this.http.get(`${this.apiUrl}?appCode=${appCode}&version=${version}`);
    }
}
