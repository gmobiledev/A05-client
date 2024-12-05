import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { TelecomServivce, UserService } from "app/auth/service";
import { AddBalanceServiceDto } from "app/auth/service/dto/add-balance-service.dto";
import { PackagesService } from "app/auth/service/packages.service";
import { TaskService } from "app/auth/service/task.service";
import {
  Priority,
  ServiceCode,
  SimType,
  TaskStatus,
} from "app/utils/constants";
import { SweetAlertService } from "app/utils/sweet-alert.service";
import dayjs from "dayjs";
dayjs.locale("vi");

@Component({
  selector: "app-task",
  templateUrl: "./task.component.html",
  styleUrls: ["./task.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class TaskComponent implements OnInit {
  public contentHeader: any = {
    headerTitle: "Danh sách",
    actionButton: true,
    breadcrumb: {
      type: "",
      links: [
        {
          name: "Home",
          isLink: true,
          link: "/",
        },
        {
          name: "Danh sách",
          isLink: false,
        },
      ],
    },
  };
  public isCreate: boolean = true;
  public price: number;
  public discount: number;

  public modalRef: any;
  public titleModal: string;
  public erroMess: string;

  public list: any;
  public listPackage;
  public totalPage: number;
  public sum: number;
  public page: number = 1;
  public pageSize: number;
  public searchForm = {
    status: "",
    page: 1,
    take: 15,
    skip: 0,
    code: "",
    service_code: "",
    date_range: "",
    topup: "",
    ignore_details: 1,
  };
  selectTopup = [
    {
      value: 0,
      label: "Tiền vào",
    },
    {
      value: 1,
      label: "Tiền ra",
    },
  ];
  dateRange: any;
  ranges: any = {
    "Hôm nay": [dayjs(), dayjs()],
    "Hôm qua": [dayjs().subtract(1, "days"), dayjs().subtract(1, "days")],
    "Tuần vừa qua": [dayjs().subtract(6, "days"), dayjs()],
    "Tháng này": [dayjs().startOf("month"), dayjs().endOf("month")],
    "Tháng trước": [
      dayjs().subtract(1, "month").startOf("month"),
      dayjs().subtract(1, "month").endOf("month"),
    ],
  };
  showBalance: boolean = false;
  balance = 0;
  formCreateLabel = {
    amount: "Số lượng",
  };
  dataCreate = {
    amount: 0,
    service_code: "",
    package: "",
    customer_id: "",
    priority: Priority.NORMAL + "",
  };
  btnCreate = "Tạo đơn hàng";
  btnFormPayment = "Tạo đơn";
  selectedItem;
  currentService;
  listServiceCode = ServiceCode;
  taskStatus = TaskStatus;
  fileExcel;
  resFailBulk = {
    message: "",
    list: [],
  };
  maxAmount = 1000000;
  selectedCustomer;
  isLoadingCustomer: boolean = false;
  listCustomer = [];
  searchCustomer = {
    keyword: "",
    page: 1,
    page_size: 20,
  };
  isDoneData: boolean = false;
  priority = Priority;
  typeSim = "simvl";

  constructor(
    private readonly taskService: TaskService,
    private readonly packageService: PackagesService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly alertService: SweetAlertService,
    private readonly modalService: NgbModal,
    private readonly userService: UserService
  ) {}

  ngOnInit(): void {
    console.log(this.route);
    const data = this.route.snapshot.data;
    this.currentService =
      data && data.service ? data.service : ServiceCode.AIRTIME_TOPUP;

    if (this.currentService == ServiceCode.SIM_PROFILE) {
      this.contentHeader.headerTitle = "Danh sách đơn profile SIM";
      this.contentHeader.breadcrumb.links[1].name = "Danh sách đơn profile SIM";
      this.formCreateLabel.amount = "Số lượng";
    } else if (this.currentService == ServiceCode.SIM_KITTING) {
      this.contentHeader.headerTitle = "Danh sách kitting";
      this.contentHeader.breadcrumb.links[1].name = "Danh sách kitting";
      this.formCreateLabel.amount = "Số lượng";
    } else if (this.currentService == ServiceCode.SIM_KITTING_ESIM) {
      this.contentHeader.headerTitle = "Danh sách kitting esim";
      this.contentHeader.breadcrumb.links[1].name = "Danh sách kitting esim";
      this.formCreateLabel.amount = "Số lượng";
    } else if (this.currentService == ServiceCode.SIM_REGISTER) {
      this.contentHeader.headerTitle = "Danh sách yêu cầu ĐKTTTB";
      this.contentHeader.breadcrumb.links[1].name = "Danh sách yêu cầu ĐKTTTB";
      this.formCreateLabel.amount = "Số lượng";
    } else if (this.currentService == ServiceCode.ADD_MONEY_BALANCE) {
      this.contentHeader.headerTitle = "Danh sách giao dịch";
      this.contentHeader.breadcrumb.links[1].name = "Danh sách giao dịch";
      this.formCreateLabel.amount = "Số tiền";
      this.maxAmount = 10000000000;
      this.btnCreate = "Nạp tiền";
    } else if (this.currentService == ServiceCode.ADD_DATA_BALANCE) {
      this.contentHeader.headerTitle = "Danh sách giao dịch Data";
      this.contentHeader.breadcrumb.links[1].name = "Danh sách giao dịch Data";
      this.formCreateLabel.amount = "Số GB";
      this.maxAmount = 10000000;
      this.btnCreate = "Mua Data";
      this.selectTopup = [
        {
          value: 0,
          label: "Mua Data",
        },
        {
          value: 1,
          label: "Nạp Data",
        },
      ];
    } else if (this.currentService == ServiceCode.SIM_BUNDLE) {
      this.contentHeader.headerTitle = "Danh sách bundle";
      this.contentHeader.breadcrumb.links[1].name = "Danh sách bundle";
      this.formCreateLabel.amount = "Số lượng";
    }
    this.searchForm.service_code = this.currentService;
    this.route.queryParams.subscribe((params) => {
      this.searchForm.code =
        params["code"] && params["code"] != undefined ? params["code"] : "";
      this.searchForm.page =
        params["page"] && params["page"] != undefined ? params["page"] : 1;
      this.searchForm.topup =
        params["topup"] && params["topup"] != undefined ? params["topup"] : "";
      this.searchForm.date_range =
        params["date_range"] && params["date_range"] != undefined
          ? params["date_range"]
          : "";
      this.getData();
    });
  }

  onItemChange(value) {
    this.typeSim = value;
  }

  modalOpen(modal, item = null) {
    if (item) {
      this.selectedItem = item;
      this.btnFormPayment = "Cập nhật";
      this.titleModal = "Cập nhật";
      this.isCreate = false;
      // this.selectedId = item.id;
      // this.dataUpdate.amount = item.amount;
      // this.dataUpdate.service_code = item.service_code;
      // this.dataUpdate.bill_id = item.bill_id;
      // this.dataUpdate.payment_method = item.payment_method;
      // this.dataUpdate.desc = item.desc;
    } else {
      // this.dataUpdate.desc = this.currentUser.phone + ' thanh toan don hang'
      this.titleModal = "Tạo đơn hàng";
      this.isCreate = true;
    }

    // this.userService.getListService().subscribe(res => {
    //   if (!res.status) {
    //     this.alertService.showMess(res.message);
    //     return;
    //   }
    //   this.listServices = res.data;
    //   this.modalRef = this.modalService.open(modal, {
    //     centered: true,
    //     windowClass: 'modal modal-primary',
    //     size: 'lg'
    //   });
    // })

    this.modalRef = this.modalService.open(modal, {
      centered: true,
      windowClass: "modal modal-primary",
      size: "lg",
    });
  }

  modalClose() {
    this.selectedItem = null;
    this.modalRef.close();
    this.price = 0;
    this.discount = 0;
    this.resFailBulk = {
      message: "",
      list: [],
    };
    this.dataCreate = {
      amount: 0,
      service_code: "",
      package: "",
      customer_id: "",
      priority: "",
    };
  }

  onInputAmount(event) {
    if (this.currentService == ServiceCode.ADD_DATA_BALANCE) {
      this.price = this.dataCreate.amount * 3000;
    }

    // console.log(this.dataCreate.amount);
    // if (this.dataUpdate.amount > 500000000 || this.dataUpdate.amount < 100000) {
    //   this.erroMess = "Số tiền trong khoảng: 100,000 - 500,000,000"
    //   return;
    // }

    // this.taskService.showPrice({ service_code: this.dataCreate.service_code, amount: this.dataCreate.amount }).subscribe(res => {
    //   this.price = res.data.amount
    //   this.discount = res.data.discount
    // })
  }

  onFocusAmount() {
    this.erroMess = "";
  }

  onSubmitSearch() {
    let tzoffset = new Date().getTimezoneOffset() * 60000;
    const daterangeString =
      this.dateRange.startDate && this.dateRange.endDate
        ? new Date(
            new Date(this.dateRange.startDate.toISOString()).getTime() -
              tzoffset
          )
            .toISOString()
            .slice(0, 10) +
          "|" +
          new Date(
            new Date(this.dateRange.endDate.toISOString()).getTime() - tzoffset
          )
            .toISOString()
            .slice(0, 10)
        : "";
    this.searchForm.date_range = daterangeString;
    this.router.navigate([window.location.pathname], {
      queryParams: this.searchForm,
    });
  }

  loadPage(page) {
    this.searchForm.page = page;
    this.router.navigate([window.location.pathname], {
      queryParams: this.searchForm,
    });
  }

  onSelectFileConfirm() {}

  onFileChangeExcelSerial(event) {
    this.fileExcel = event.target.files[0];
  }

  async onCreateTask() {
    if (this.currentService == ServiceCode.SIM_PROFILE) {
      if (
        (await this.alertService.showConfirm("Bạn có đồng ý tạo đơn?")).value
      ) {
        this.onCreateTaskSimProfile();
      }
    } else if (
      this.currentService == ServiceCode.ADD_DATA_BALANCE ||
      this.currentService == ServiceCode.ADD_MONEY_BALANCE
    ) {
      if (!this.dataCreate.amount) {
        this.alertService.showMess("Vui lòng nhập số lượng");
        return;
      }
      if (
        (await this.alertService.showConfirm("Bạn có đồng ý tạo đơn?")).value
      ) {
        this.onCreateBalanceService();
      }
    } else if (this.currentService == ServiceCode.SIM_KITTING) {
      if (!this.fileExcel) {
        this.alertService.showMess("Vui lòng tải file để Kitting");
        return;
      }
      if (
        (await this.alertService.showConfirm("Bạn có đồng ý tạo đơn?")).value
      ) {
        this.onCreateKitting();
      }
    } else if (this.currentService == ServiceCode.SIM_KITTING_ESIM) {
      if (!this.fileExcel) {
        this.alertService.showMess("Vui lòng tải file để Kitting Esim");
        return;
      }
      if (
        (await this.alertService.showConfirm("Bạn có đồng ý tạo đơn?")).value
      ) {
        this.onCreateKittingEsim();
      }
    } else if (this.currentService == ServiceCode.SIM_REGISTER) {
      if (!this.fileExcel) {
        this.alertService.showMess("Vui lòng tải file để Kitting");
        return;
      }
      if (
        (await this.alertService.showConfirm("Bạn có đồng ý tạo đơn?")).value
      ) {
        this.onCreateSimRegister();
      }
    } else if (this.currentService == ServiceCode.SIM_BUNDLE) {
      if (!this.fileExcel) {
        this.alertService.showMess("Vui lòng tải file để Kitting");
        return;
      }
      if (
        (await this.alertService.showConfirm("Bạn có đồng ý tạo đơn?")).value
      ) {
        this.onCreateBundle();
      }
    }
  }

  onCreateTaskSimProfile() {
    if (!this.dataCreate.amount) {
      this.alertService.showMess("Vui lòng nhập số lượng");
      return;
    }
    let dataPost = {
      amount: this.dataCreate.amount,
      sim_type: this.typeSim == "simvl" ? SimType.PHYSICAL : SimType.ESIM,
    };
    this.taskService.orderSIMProfile(dataPost).subscribe(
      (res) => {
        if (res.status == 1) {
          this.alertService.showSuccess(res.message);
          this.modalClose();
          this.router.navigate(["/task", res.data.task.id]);
        } else {
          this.alertService.showMess(res.message);
          this.modalClose();
        }
      },
      (error) => {
        this.alertService.showMess(error);
      }
    );
  }

  onCreateBalanceService() {
    let dataPost = new AddBalanceServiceDto();
    dataPost.amount = this.dataCreate.amount;
    dataPost.type = this.currentService;

    this.taskService.addBalance(dataPost).subscribe(
      (res) => {
        this.alertService.showSuccess(res.message);
        this.modalClose();
        this.router.navigate(["/task", res.data.task.id]);
      },
      (error) => {
        this.alertService.showMess(error);
      }
    );
  }

  onCreateKitting() {
    let formData = new FormData();
    formData.append("files", this.fileExcel);
    formData.append("package", this.dataCreate.package);
    formData.append("priority", this.dataCreate.priority);
    this.taskService.createKitting(formData).subscribe(
      (res) => {
        if (!res.status) {
          // this.alertService.showMess(res.message);
          if (this.resFailBulk.list && this.resFailBulk.list.length > 0) {
            this.resFailBulk.message = res.message;
            this.resFailBulk.list = res.data.list.map((x) => {
              return { name: x };
            });
          } else {
            this.alertService.showMess(res.message);
          }
          return;
        }
        this.alertService.showSuccess(res.message);
        this.modalClose();
        this.router.navigate(["/task", res.data.task.id]);
      },
      (error) => {
        this.alertService.showMess(error);
      }
    );
  }

  onCreateKittingEsim() {
    let formData = new FormData();
    formData.append("files", this.fileExcel);
    formData.append("package", this.dataCreate.package);
    formData.append("priority", this.dataCreate.priority);
    this.taskService.createKittingEsim(formData).subscribe(
      (res) => {
        if (!res.status) {
          // this.alertService.showMess(res.message);
          if (this.resFailBulk.list && this.resFailBulk.list.length > 0) {
            this.resFailBulk.message = res.message;
            this.resFailBulk.list = res.data.list.map((x) => {
              return { name: x };
            });
          } else {
            this.alertService.showMess(res.message);
          }
          return;
        }
        this.alertService.showSuccess(res.message);
        this.modalClose();
        this.router.navigate(["/task", res.data.task.id]);
      },
      (error) => {
        this.alertService.showMess(error);
      }
    );
  }

  onCreateBundle() {
    let formData = new FormData();
    formData.append("files", this.fileExcel);
    formData.append("package", this.dataCreate.package);
    this.taskService.createBundle(formData).subscribe(
      (res) => {
        if (!res.status) {
          // this.alertService.showMess(res.message);
          if (this.resFailBulk.list && this.resFailBulk.list.length > 0) {
            this.resFailBulk.message = res.message;
            this.resFailBulk.list = res.data.list.map((x) => {
              return { name: x };
            });
          } else {
            this.alertService.showMess(res.message);
          }

          return;
        }
        this.alertService.showSuccess(res.message);
        this.modalClose();
        this.router.navigate(["/task", res.data.task.id]);
      },
      (error) => {
        this.alertService.showMess(error);
      }
    );
  }

  onCreateSimRegister() {
    let formData = new FormData();
    formData.append("files", this.fileExcel);
    formData.append("customer_id", this.dataCreate.customer_id);
    formData.append("priority", this.dataCreate.priority);

    this.taskService.createSimRegister(formData).subscribe(
      (res) => {
        if (!res.status) {
          this.alertService.showMess(res.message);
          return;
        }
        this.alertService.showSuccess(res.message);
        this.modalClose();
        this.router.navigate(["/task", res.data.task.id]);
      },
      (error) => {
        this.alertService.showMess(error);
      }
    );
  }

  async onCancelTask(item) {
    if ((await this.alertService.showConfirm("Bạn có đồng ý hủy đơn?")).value) {
      this.taskService.getTaskDelete(item.id).subscribe(
        (res) => {
          this.alertService.showSuccess(res.message);
          this.getData();
          this.modalClose();
        },
        (error) => {
          this.alertService.showMess(error);
        }
      );
    }
  }

  toggleBalanceTextType() {
    this.userService.showBanalace(this.currentService).subscribe(
      (res) => {
        this.balance = res.data.Balance;
        this.showBalance = !this.showBalance;
      },
      (error) => {
        console.log("ERRRR");
        console.log(error);
      }
    );
  }

  getJSONDetail(item, key) {
    const r = item.detail ? JSON.parse(item.detail) : null;
    if (!r) {
      return null;
    }
    return r[key] ? r[key] : null;
  }

  getData(): void {
    this.searchForm.skip = (this.searchForm.page - 1) * this.searchForm.take;
    this.packageService
      .getAll({ type: 1, category: "INBOUD_TOUR" })
      .subscribe((res) => {
        this.listPackage = res.data.packages;
      });
    this.taskService.getAllTask(this.searchForm).subscribe(
      (res) => {
        this.list = res.data.tasks;
        this.totalPage = res.data.count;
        this.pageSize = res.data.pageSize;
        this.sum = res.data.sum;
      },
      (error) => {
        console.log("ERRRR");
        console.log(error);
      }
    );
    this.userService
      .getListCustomerOrganization(this.searchCustomer)
      .subscribe((res) => {
        this.listCustomer = res.data.items;
      });
  }

  onScroll(event) {
    console.log(event);
  }

  onScrollToEnd() {
    if (!this.isDoneData) {
      this.searchCustomer.page++;
      this.fetchMore();
    }
  }

  onSearch(event) {
    this.searchCustomer.keyword = event.term;
    this.searchCustomer.page = 1;
    this.isLoadingCustomer = true;
    this.userService
      .getListCustomerOrganization(this.searchCustomer)
      .subscribe((res) => {
        this.isLoadingCustomer = false;
        this.listCustomer = res.data.items;
      });
  }

  fetchMore() {
    this.isLoadingCustomer = true;
    this.userService
      .getListCustomerOrganization(this.searchCustomer)
      .subscribe((res) => {
        this.isLoadingCustomer = false;
        if (res.data.items.length > 0) {
          Array.prototype.push.apply(this.listCustomer, res.data.items);
        } else {
          this.isDoneData = true;
        }
      });
  }
}
