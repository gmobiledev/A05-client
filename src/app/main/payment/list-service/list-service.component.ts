import { CoreConfigService } from '@core/services/config.service';
import { TelecomServivce } from 'app/auth/service';
import { mobilePhoneValidator } from 'app/shared/custom-validator';
import { Subject } from 'rxjs';
import { takeUntil, first } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AdminService } from 'app/auth/service/admin.service';
import { DatePipe } from '@angular/common';
import { UserService } from 'app/auth/service';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from 'app/auth/service/task.service';
import { SweetAlertService } from 'app/utils/sweet-alert.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ObjectLocalStorage } from 'app/utils/constants';


@Component({
  selector: 'app-list-service',
  templateUrl: './list-service.component.html',
  styleUrls: ['./list-service.component.scss']
})


export class ListServiceComponent implements OnInit {


  @BlockUI('item-block') itemBlockUI: NgBlockUI;

  public contentHeader: any;
  public list: any;
  public totalPage: number;
  public page: number = 1;
  public pageSize: number;

  public isViewFile: boolean = false;
  public urlFile: any;
  public listServices: any;

  public price: number;
  public discount: number;

  public modalRef: any;
  public titleModal: string;
  public formGroup: FormGroup;
  public subFormGroup: FormGroup;
  public modalUserCodeRef: any;
  public formGroupUserCode: FormGroup;
  public isCreate: boolean = false;
  public submitted: boolean = false;
  public exitsUser: boolean = false;
  public isShowAddInput: boolean = true;
  public selectedUserId: number;
  public selectedId: number;
  public selectedItem: any;
  public fileAccount: any;
  public erroMess: string;
  public imageFront;
  public currentUser;

  public btnFormPayment = 'Tạo đơn hàng';

  public searchForm = {
    status: '',
    page: 1,
    take: 10,
    skip: 0,
    service_code: '',
    date_range: '',
    topup: ''

  }

  constructor(
    private taskService: TaskService,
    private alertService: SweetAlertService,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private userService: UserService,


  ) {
    this.route.queryParams.subscribe(params => {
      this.searchForm.status = params['status'] && params['status'] != undefined ? params['status'] : '';
      this.searchForm.page = params['page'] && params['page'] != undefined ? params['page'] : 1;
      this.searchForm.take = params['take'] && params['take'] != undefined ? params['take'] : 10;
      this.searchForm.skip = (this.searchForm.page - 1) * this.searchForm.take;
      this.searchForm.service_code = params['service_code'] && params['service_code'] != undefined ? params['service_code'] : 'AIRTIME_TOPUP';
      this.searchForm.date_range = params['date_range'] && params['date_range'] != undefined ? params['date_range'] : '';

      this.getData();
    })
  }

  public dataUpdate = {
    amount: 0,
    service_code: "AIRTIME_TOPUP",
    bill_id: "0356342770",
    payment_method: "BANK_TRANSFER",
    desc: '',
    file: "",
    files_confirm: ""
  };


  modalOpen(modal, item = null) {
    if (item) {
      this.selectedItem = item;
      this.btnFormPayment = 'Cập nhật';
      this.titleModal = "Cập nhật";
      this.isCreate = false;
      this.selectedId = item.id;
      this.dataUpdate.amount = item.amount;
      this.dataUpdate.service_code = item.service_code;
      this.dataUpdate.bill_id = item.bill_id;
      this.dataUpdate.payment_method = item.payment_method;
      this.dataUpdate.desc = item.desc;
    } else {
      this.dataUpdate.desc = this.currentUser.phone + ' thanh toan don hang'
      this.titleModal = "Tạo đơn hàng";
      this.isCreate = true;
    }


    this.userService.getListService().subscribe(res => {
      if (!res.status) {
        this.alertService.showMess(res.message);
        return;
      }
      this.listServices = res.data;
      this.modalRef = this.modalService.open(modal, {
        centered: true,
        windowClass: 'modal modal-primary',
        size: 'lg'
      });
    })

  }

  async onSelectFileAccount(event) {
    this.fileAccount = event.target.files[0];
  }

  async onSelectFileConfirm(event) {
    if (event.target.files && event.target.files[0]) {
      let img = await this.resizeImage(event.target.files[0]);
      this.dataUpdate.files_confirm = (img + '').replace('data:image/png;base64,', '')
    }
  }

  modalClose() {
    this.selectedItem = null;
    this.modalRef.close();
    this.initForm();
    this.dataUpdate = {
      amount: 0,
      service_code: "AIRTIME_TOPUP",
      bill_id: this.currentUser.phone,
      payment_method: "BANK_TRANSFER",
      desc: '',
      file: '',
      files_confirm: '',
    };
    this.price = 0;
    this.discount = 0;
  }

  onInputAmount(event) {
    console.log(this.dataUpdate.amount);
    // if (this.dataUpdate.amount > 500000000 || this.dataUpdate.amount < 100000) {
    //   this.erroMess = "Số tiền trong khoảng: 100,000 - 500,000,000"
    //   return;
    // }

    this.taskService.showPrice({ service_code: this.dataUpdate.service_code, amount: this.dataUpdate.amount }).subscribe(res => {
      this.price = res.data.amount
      this.discount = res.data.discount
    })
  }

  onFocusAmount() {
    this.erroMess = ""
  }


  initForm() {
    this.formGroup = this.formBuilder.group({
      mobile: ['', Validators.required],
      password: ['', Validators.required],
      partner_user_code: [''],
      channel_id: [''],
      agents_service: this.formBuilder.array([]),
      new_agents_service: this.formBuilder.array([])
    });

    this.formGroupUserCode = this.formBuilder.group({
      partner_user_code: [''],
      channel_id: [''],
    });

    this.exitsUser = false;
    this.isCreate = true;
  }

  onSubmitSearch(): void {
    this.router.navigate(['/payment/list'], { queryParams: this.searchForm })
  }

  loadPage(page) {
    this.searchForm.page = page;
    this.router.navigate(['/payment/list'], { queryParams: this.searchForm })
  }

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem(ObjectLocalStorage.CURRENT_USER));
    this.dataUpdate.bill_id = this.currentUser.phone;
    this.contentHeader = {
      headerTitle: 'Danh sách giao dịch',
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
            name: 'Payments',
            isLink: false
          }
        ]
      }
    };
  }

  getData(): void {
    this.taskService.getAllTask(this.searchForm).subscribe(res => {
      this.list = res.data.tasks;
      this.totalPage = res.data.count;
      this.pageSize = res.data.pageSize;
    }, error => {
      console.log("ERRRR");
      console.log(error);
    })
  }


  getDiscount(details: any) {
    let obj = details.find((o: { attribute: string; }) => o.attribute === 'discount');
    if (obj != null) {
      return obj.value;
    } else {
      return 0;
    }

  }

  getAmountBefore(details: any, amount: number) {
    let obj = details.find((o: { attribute: string; }) => o.attribute === 'amount_before');
    if (obj != null) {
      return obj.value;
    } else {
      return amount;
    }
  }

  async onCancelTask(item) {
    if ((await this.alertService.showConfirm("Bạn có chắc chắn muốn hủy đơn hàng này không?")).value) {
      this.itemBlockUI.start();
      this.taskService.getTaskDelete(item.id).subscribe(res => {
        this.itemBlockUI.stop();
        if (!res.status) {
          this.alertService.showMess(res.message);
          return;
        }
        this.alertService.showSuccess(res.message);
        this.modalClose();
      }, error => {
        this.itemBlockUI.stop();
        this.alertService.showMess(error);
        return;
      })
    }
  }

  async onSelectFileFront(event) {
    if (event.target.files && event.target.files[0]) {
      this.imageFront = await this.resizeImage(event.target.files[0])
    }
  }

  resizeImage(image) {
    return new Promise((resolve) => {
      let fr = new FileReader;
      fr.onload = () => {
        var img = new Image();
        img.onload = () => {
          console.log(img.width);
          let width = img.width < 900 ? img.width : 900;
          let height = img.width < 900 ? img.height : width * img.height / img.width;
          console.log(width, height);
          let canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          let ctx = canvas.getContext('2d');
          if (ctx != null) {
            ctx.drawImage(img, 0, 0, width, height);
          }
          let data = canvas.toDataURL('image/png');
          resolve(data);
        };

        // @ts-ignore
        img.src = fr.result;
      };

      fr.readAsDataURL(image);
    })
  }

  async onCreateTask() {
    if (this.dataUpdate.amount < 100000) {
      this.alertService.showMess("Vui lòng Nhập số tiền lớn hơn 100.000 VNĐ");
      return;
    }
    
    if (this.isCreate) {
      if (this.imageFront == null) {
        this.alertService.showMess("Vui lòng tải file ảnh đơn hàng lên!");
        return;
      }

      if ((await this.alertService.showConfirm("Bạn có đồng ý tạo đơn hàng này không?")).value) {
        if (this.imageFront) {
          this.dataUpdate.file = this.imageFront.replace('data:image/png;base64,', '')
        }
        this.itemBlockUI.start();
        this.taskService.getCreateTask(this.dataUpdate).subscribe(res => {
          this.itemBlockUI.stop();
          if (!res.status) {
            this.alertService.showMess(res.message);
            return;
          }
          this.alertService.showSuccess(res.message);
          this.modalClose();
          this.router.navigateByUrl(`/payment/${res.data.id}`)
          this.getData();
        }, error => {
          this.itemBlockUI.stop();
          this.alertService.showMess(error);
          return;
        })
      }
    } else {
      if ((await this.alertService.showConfirm("Bạn có đồng ý cập nhật đơn hàng này không?")).value) {
        if (this.imageFront) {
          this.dataUpdate.file = this.imageFront.replace('data:image/png;base64,', '')
        }
        this.itemBlockUI.start();
        this.taskService.updateTaskPayment(this.selectedId, this.dataUpdate).subscribe(res => {
          this.itemBlockUI.stop();
          if (!res.status) {
            this.alertService.showMess(res.message);
            return;
          }
          this.alertService.showSuccess(res.message);
          this.modalClose();
          this.getData();
        }, error => {
          this.itemBlockUI.stop();
          this.alertService.showMess(error);
          return;
        })
      }
    }
  }

}

