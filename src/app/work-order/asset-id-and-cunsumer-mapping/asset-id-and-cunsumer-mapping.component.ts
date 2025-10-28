import { Component } from '@angular/core';
import { MobileUtils } from 'src/app/lib/mobile-utils';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-asset-id-and-cunsumer-mapping',
  templateUrl: './asset-id-and-cunsumer-mapping.component.html',
  styleUrls: ['./asset-id-and-cunsumer-mapping.component.scss'],
})
export class AssetIdAndCunsumerMappingComponent {
  items: { meter: string; account: string }[] = [];
  meterOptions = ['Meter 1', 'Meter 2', 'Meter 3'];
  accountOptions = ['Account 1', 'Account 2', 'Account 3'];
  meterValue: string = '';
  accountValue: string = '';
  constructor() {}

  handleFile(event: any): void {
    const file: File = event.target.files[0];
    const fileReader: FileReader = new FileReader();
    fileReader.onload = (e: any) => {
      const data: Uint8Array = new Uint8Array(e.target.result);
      const workbook: XLSX.WorkBook = XLSX.read(data, { type: 'array' });
      const worksheet: XLSX.WorkSheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      // Process the data as needed
      console.log(jsonData);
      this.items = jsonData;
      console.log('', this.items);
    };
    fileReader.readAsArrayBuffer(file);
  }

  downloadTableData() {
    const table = document.querySelector('table');
    const tableData = [];
    const headers = [];

    // Extract column names from table headers
    const headerCells = table.querySelectorAll('thead th');
    headerCells.forEach((headerCell) => {
      headers.push(headerCell.textContent);
    });

    // Extract data from table rows
    const tableRows = table.querySelectorAll('tbody tr');
    tableRows.forEach((tableRow) => {
      const rowData = [];
      const dataCells = tableRow.querySelectorAll('td');
      dataCells.forEach((dataCell) => {
        rowData.push(dataCell.textContent);
      });
      tableData.push(rowData);
    });

    // Create workbook and worksheet
    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...tableData]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Table Data');

    // Generate Excel file
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });

    // Trigger download
    const downloadLink = document.createElement('a');
    downloadLink.href = window.URL.createObjectURL(blob);
    downloadLink.download = 'table_data.xlsx';
    if (typeof cordova !== 'undefined') { MobileUtils.downloadFileOnMobileByNameOnly(downloadLink.download, blob); } else { downloadLink.click(); }
  }

  isMeterSelected(item: string): boolean {
    return this.items.some((row) => row.meter === item);
  }

  addRow(): void {
    if (this.meterValue && this.accountValue) {
      const newItem = { meter: this.meterValue, account: this.accountValue };
      this.items.push(newItem);
      this.clearSelections();
    }
  }

  deleteRow(index: number): void {
    this.items.splice(index, 1);
  }

  private clearSelections(): void {
    this.meterValue = '';
    this.accountValue = '';
  }
}
