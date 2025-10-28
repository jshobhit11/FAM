import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  showSnackBar(arg0: any) {
    console.log(arg0);
    throw new Error('Method not implemented.');
  }

  constructor() {}
}
