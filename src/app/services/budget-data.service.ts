import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BudgetDataService {
  private readonly TABLE_DATA_KEY = 'tableData';
  private readonly BUDGET_DATA_KEY = 'budgetData';
  private divisionalAccHeadDetails: any[] = [];
  private tableData: any[] = [];
  setBudgetData(data: any[]): void {
    sessionStorage.setItem(this.BUDGET_DATA_KEY, JSON.stringify(data));
  }

  getBudgetData(): any[] {
    const storedData = sessionStorage.getItem(this.BUDGET_DATA_KEY);
    return storedData ? JSON.parse(storedData) : [];
  }

  setDivisionalAccHeadDetails(data: any[]): void {
    this.divisionalAccHeadDetails = data;
  }

  getDivisionalAccHeadDetails(): any[] {
    return this.divisionalAccHeadDetails;
  }

  setTableData(data: any[]): void {
    this.tableData = data;
    sessionStorage.setItem('tableData', JSON.stringify(data));
  }

  getTableData(): any[] {
    //return this.tableData;
    const storedData = sessionStorage.getItem('tableData');
    return storedData ? JSON.parse(storedData) : [];
  }
}
