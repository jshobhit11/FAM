import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
    providedIn: 'root'
})


export class VersionService {

    private apiUrl = 'http://localhost:8081/api/version/check';

    constructor(private http: HttpClient) { }

    validateApp(appCode: number, version: number): Observable<any> {
        return this.http.get(`${this.apiUrl}?appCode=${appCode}&version=${version}`);
    }
}