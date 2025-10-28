import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-budget-approval-details',
  templateUrl: './budget-approval-details.component.html',
  styleUrls: ['./budget-approval-details.component.scss'],
})
export class BudgetApprovalDetailsComponent implements OnInit {
  budgetData: any[] = [];
  divisionalAccHeadDetails: any[] = [];
  tableData: any[] = [];
  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const jsonData = params['data'];
      if (jsonData) {
        this.budgetData.push(JSON.parse(jsonData)); // Push the parsed object into the array
      }
    });
    console.log('details Data', this.budgetData);
  }

  approveBudget() {
    this.router.navigate(['/work-management/budget-approval'], {
      queryParams: { tableData: JSON.stringify(this.tableData) },
    });
  }
}
