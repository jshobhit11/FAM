import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RcDataSharedService {
  private rateTypeData: any[];
  private vendorNameData: any[];
  constructor() {}
  setRateTypeData(data: any[]) {
    this.rateTypeData = data;
  }

  getRateTypeData(): any[] {
    return this.rateTypeData;
  }

  setVendorNameData(data: any[]) {
    this.vendorNameData = data;
  }

  getVendorNameData(): any[] {
    return this.vendorNameData;
  }
}
