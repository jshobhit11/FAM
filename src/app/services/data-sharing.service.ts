import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class DataSharingService {

  private alternateMaterialsData = new BehaviorSubject<any[]>([]);
  alternateMaterialsData$ = this.alternateMaterialsData.asObservable();

  updateAlternateMaterialsData(data: any[]) {
    this.alternateMaterialsData.next(data);
  }
}

