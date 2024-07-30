import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.scss']
})
export class OrganizationComponent implements OnInit {
  // public
  public contentHeader: object;
  public isCollapsed5 = true;



  constructor() {}
  /**
   * On init
   */
  ngOnInit(): void {
    // content header
    this.contentHeader = {
      headerTitle: 'Doanh nghiệp',
      actionButton: true,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'Trang chủ',
            isLink: true,
            link: '/'
          },
          {
            name: 'Đấu nối tổ chức - Doanh nghiệp',
            isLink: false
          }
        ]
      }
    };
  }
}
