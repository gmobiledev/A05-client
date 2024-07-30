import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'app/auth/service';
import { SweetAlertService } from 'app/utils/sweet-alert.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.scss']
})
export class ListUserComponent implements OnInit {
  public contentHeader: any;
  public list: any;
  public totalPage: number;
  public page: number = 1;
  public pageSize: number;
  public searchForm = {
    keyword: '',
    status: ''
  }

  @BlockUI('section-block') sectionBlockUI: NgBlockUI;

  constructor(
    private userService: UserService,
    private alertService: SweetAlertService,
    private route: ActivatedRoute,
    private router: Router,
  ) { 
    this.route.queryParams.subscribe(params => {
      this.searchForm.keyword = params['keyword'] && params['keyword'] != undefined ? params['keyword'] : '';
      this.searchForm.status = params['status'] && params['status'] != undefined ? params['status'] : '';

      // this.getData();
    })
  }

  onSubmitSearch(): void {
    this.router.navigate(['/user/list'], { queryParams: {keyword: this.searchForm.keyword, status: this.searchForm.status}})
  }

  async onSubmitLock(id, status){
    const confirmMessage = status ? "Bạn có đồng ý mở khóa user?" : "Bạn có đồng ý khóa user?";
    if((await this.alertService.showConfirm(confirmMessage)).value) {
      this.userService.lockUser(id, status, "").subscribe(res => {
        if(!res.status) {
          this.alertService.showError(res.message);
          return;
        }
        this.alertService.showSuccess(res.message);
        this.getData();
      }, err => {
        this.alertService.showError(err);
      })
    }
  }

  ngOnInit(): void {
    this.contentHeader = {
      headerTitle: 'Danh sách user',
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
            name: 'Danh sách user',
            isLink: false
          }
        ]
      }
    };    
  }

  getData(): void {
    this.sectionBlockUI.start();
    this.userService.getAll(this.searchForm).subscribe(res => {
      this.sectionBlockUI.stop();
      this.list = res.data.items;
      this.totalPage = res.data.count;
      this.pageSize = res.data.pageSize;
    }, error => {
      this.sectionBlockUI.stop();
      console.log("ERRRR");
      console.log(error);
    })
  }

}
