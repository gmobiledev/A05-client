import { Component, OnInit } from '@angular/core';
import { AdminService } from 'app/auth/service/admin.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

  public contentHeader: any;
  public list: any;

  constructor(
    private adminService: AdminService
  ) { 
    // this.getData();  
  }

  ngOnInit(): void {
    this.contentHeader = {
      headerTitle: 'Tổng quan',
      actionButton: true,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'Home',
            isLink: true,
            link: '/'
          },
          {
            name: 'Tổng quan',
            isLink: false
          }
        ]
      }
    };
  }

  getData() {
    this.adminService.getReports().subscribe(res => {
      this.list = res.data;
    })
  }

}
