import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { AddLabourMasterItemComponent } from './add-labour-master-item/add-labour-master-item.component';
import { UpdateLabourMasterItemComponent } from './update-labour-master-item/update-labour-master-item.component';

export interface LabourName {
  materialType: string;
  labourItem: string;
  labourCode: string;
  labourRate: number;
  labourUnit: string;
}

const LabourMaster_DATA: LabourName[] = [
  {
    materialType: 'Pole',
    labourCode: '-',
    labourItem: 'Labour 1',
    labourRate: 1211,
    labourUnit: '100 each',
  },
  {
    materialType: 'Cable',
    labourCode: '-',
    labourItem: 'Labour 2',
    labourRate: 1212,
    labourUnit: '200 each',
  },
  {
    materialType: 'Iron',
    labourCode: '-',
    labourItem: 'Labour 3',
    labourRate: 1213,
    labourUnit: '300 each',
  },
  {
    materialType: 'Copper',
    labourCode: '-',
    labourItem: 'Labour 4',
    labourRate: 1214,
    labourUnit: '400 each',
  },
  {
    materialType: 'Gold',
    labourCode: '-',
    labourItem: 'Labour 5',
    labourRate: 1215,
    labourUnit: '500 each',
  },
  {
    materialType: 'Silver',
    labourCode: '-',
    labourItem: 'Labour 6',
    labourRate: 1216,
    labourUnit: '100 each',
  },
  {
    materialType: 'Plat',
    labourCode: '-',
    labourItem: 'Labour 7',
    labourRate: 1217,
    labourUnit: '200 each',
  },
  {
    materialType: 'Diamond',
    labourCode: '-',
    labourItem: 'Labour 8',
    labourRate: 1218,
    labourUnit: '300 each',
  },
  {
    materialType: 'Radiant',
    labourCode: '-',
    labourItem: 'Labour 9',
    labourRate: 1219,
    labourUnit: '400 each',
  },
  {
    materialType: 'Nickel',
    labourCode: '-',
    labourItem: 'Labour 10',
    labourRate: 1220,
    labourUnit: '500 each',
  },
  {
    materialType: 'Boron',
    labourCode: '-',
    labourItem: 'Labour 11',
    labourRate: 1221,
    labourUnit: '100 each',
  },
  {
    materialType: 'Carbon',
    labourCode: '-',
    labourItem: 'Labour 12',
    labourRate: 1222,
    labourUnit: '200 each',
  },
  {
    materialType: 'Bronze',
    labourCode: '-',
    labourItem: 'Labour 13',
    labourRate: 1223,
    labourUnit: '300 each',
  },
];
@Component({
  selector: 'app-labour-master',
  templateUrl: './labour-master.component.html',
  styleUrls: ['./labour-master.component.scss'],
})
export class LabourMasterComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;

  dataSource = new MatTableDataSource(LabourMaster_DATA);
  constructor(public dialog: MatDialog) {}

  displayedColumns: string[] = ['slno', 'materialType', 'labourItem', 'labourCode', 'labourRate', 'labourUnit', 'action'];

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openAddLabourItemDialog() {
    this.dialog.open(AddLabourMasterItemComponent, {
      width: '100%',
    });
  }

  openUpdateLabourItemDialog() {
    this.dialog.open(UpdateLabourMasterItemComponent, {
      width: '100%',
    });
  }
}
