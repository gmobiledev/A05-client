import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-list-so',
  templateUrl: './list-so.component.html',
  styleUrls: ['./list-so.component.scss']
})
export class ListSoComponent implements OnInit {

  public contentHeader: any;
  constructor() { }

  ngOnInit(): void {
  }

  initData() {
    this.contentHeader = {
      headerTitle: 'Danh sách số',
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
            name: 'Danh sách số',
            isLink: false
          }
        ]
      }
    };
  }

}
