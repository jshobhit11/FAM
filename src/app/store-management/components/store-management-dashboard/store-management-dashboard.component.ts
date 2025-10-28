import { Component, OnInit } from '@angular/core';
import { DashboardService } from 'src/app/services/dashboard.service';
@Component({
  selector: 'app-store-management-dashboard',
  templateUrl: './store-management-dashboard.component.html',
  styleUrls: ['./store-management-dashboard.component.scss'],
})
export class StoreManagementDashboardComponent implements OnInit {
  sideBarOpen = true;
  data: any;
  data2: any;
  data3: any;
  data4: any;
  options: any;
  options2: any;
  options3: any;
  options4: any;

  constructor(private dashboardService: DashboardService) {}

  async ngOnInit() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
    const officeCode = sessionStorage.getItem('office-id');

    const mainCategoryFilter: any = {
      apiKey,
      serviceKey,
      userRole,
      userName,
      userCode,
      officeCode,

    };
    this.data = await this.dashboardService.GetPendingStoreApplicationsCountForUser(
      mainCategoryFilter
    );

  //console.log('this.Count DATA======',this.data );

    const labels = this.data.map(item => item.typeOfIndent);
    const dataValues = this.data.map(item => parseInt(item.pendingCount, 10));
    this.data = {
      labels: labels,
      datasets: [
        {
          data: dataValues,
          backgroundColor: [
            documentStyle.getPropertyValue('--blue-500'),
            documentStyle.getPropertyValue('--yellow-500'),
            documentStyle.getPropertyValue('--green-500'),
            documentStyle.getPropertyValue('--bluegray-500'),
            documentStyle.getPropertyValue('--blue-500'),
            documentStyle.getPropertyValue('--yellow-500'),
            documentStyle.getPropertyValue('--green-500'),
            documentStyle.getPropertyValue('--bluegray-500'),
            documentStyle.getPropertyValue('--blue-500'),
            documentStyle.getPropertyValue('--yellow-500'),
            documentStyle.getPropertyValue('--green-500'),
            documentStyle.getPropertyValue('--bluegray-500'),
            documentStyle.getPropertyValue('--blue-500'),
            // You can add more colors or generate dynamically based on the data length
          ].slice(0, dataValues.length), // Ensures we only use as many colors as we have data points
          hoverBackgroundColor: [
            documentStyle.getPropertyValue('--blue-400'),
            documentStyle.getPropertyValue('--yellow-400'),
            documentStyle.getPropertyValue('--green-400'),
            documentStyle.getPropertyValue('--bluegray-400'),
            documentStyle.getPropertyValue('--blue-400'),
            documentStyle.getPropertyValue('--yellow-400'),
            documentStyle.getPropertyValue('--green-400'),
            documentStyle.getPropertyValue('--bluegray-400'),
            documentStyle.getPropertyValue('--blue-400'),
            documentStyle.getPropertyValue('--yellow-400'),
            documentStyle.getPropertyValue('--green-400'),
            documentStyle.getPropertyValue('--bluegray-400'),
            documentStyle.getPropertyValue('--blue-400'),
            // Similarly for hover colors
          ].slice(0, dataValues.length),
        },
      ],
    };
    this.options = {
      plugins: {
        legend: {
          labels: {
            usePointStyle: true,
            color: textColor,
          },
        },
      },
    };
  }

  sideBarToggler() {
    this.sideBarOpen = !this.sideBarOpen;
  }
}
