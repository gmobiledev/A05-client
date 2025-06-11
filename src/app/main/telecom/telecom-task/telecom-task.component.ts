import { formatDate } from "@angular/common";
import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { TelecomServivce } from "app/auth/service";
import {
  ObjectLocalStorage,
  TaskTelecom,
  TaskTelecomStatus,
} from "app/utils/constants";
import { SweetAlertService } from "app/utils/sweet-alert.service";
import { BlockUI, NgBlockUI } from "ng-block-ui";
import dayjs from "dayjs";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { GSubService } from "app/auth/service/gsub.service";

@Component({
  selector: "app-telecom-task",
  templateUrl: "./telecom-task.component.html",
  styleUrls: ["./telecom-task.component.scss"],
})
export class TelecomTaskComponent implements OnInit {
  @ViewChildren("taskItem") listTaskItems: QueryList<ElementRef>;
  public isInViewEl: boolean = false;

  public contentHeader: any = {
    headerTitle: "Lịch sử đấu nối",
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
          name: "Lịch sử đấu nối",
          isLink: false,
        },
      ],
    },
  };
  public list = [];
  public listSucessMsisdn;
  public isSentOtp: boolean = false;
  public formOTPMsisdn = {
    mobile: "",
    otp: "",
  };
  public totalItems: number;
  public hasNextPage: boolean = true;

  public summaryTask: any;

  public isActivedBoxNewInit: boolean = false;
  public isActivedBoxNewProcessing: boolean = false;
  public isActivedBoxUpdateInit: boolean = false;
  public isActivedBoxUpdateProcessing: boolean = false;
  public isActivedBoxChangeSimInit: boolean = false;
  public isActivedBoxChangeSimProcessing: boolean = false;

  public listTaskAction = TaskTelecom.ACTION;
  public taskTelecomStatus;
  public selectedItem: any;
  public selectedAgent: any;
  public mineTask = false;
  public currentUser: any;
  public isAdmin: boolean = false;
  public mnos: any = [];
  public fileContract;
  public customer_id;
  notData = false;

  public searchForm: any = {
    // mobile: '',
    action: "",
    keysearch: "",
    status: "",
    // mine: '',
    skip: 0,
    // array_status: [],
    take: 20,
    // date_range: '',
    // telco: ''
  };
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

  public modalRef: any;

  @BlockUI("item-block") itemBlockUI: NgBlockUI;

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private activeRouted: ActivatedRoute,
    private telecomService: TelecomServivce,
    private alertService: SweetAlertService,
    private gsubService: GSubService
  ) {
    this.dateRange = null;
    this.activeRouted.queryParams.subscribe((params) => {
      this.taskTelecomStatus = Object.keys(TaskTelecomStatus)
        .filter((p) => !Number.isInteger(parseInt(p)))
        .reduce((obj, key) => {
          obj[key] = TaskTelecomStatus[key];
          return obj;
        }, {});

      // this.searchForm.mobile = params['mobile'] && params['mobile'] != undefined ? params['mobile'] : '';
      this.searchForm.status =
        params["status"] && params["status"] != undefined
          ? params["status"]
          : "";
      // this.searchForm.mine = params['mine'] && params['mine'] != undefined ? params['mine'] : '';
      this.searchForm.keysearch =
        params["keysearch"] && params["keysearch"] != undefined
          ? params["keysearch"]
          : "";
      this.searchForm.action =
        params["action"] && params["action"] != undefined
          ? params["action"]
          : "";
      // this.searchForm.page = params['page'] && params['page'] != undefined ? params['page'] : 1;
      // this.searchForm.date_range = params['date_range'] && params['date_range'] != undefined ? params['date_range'] : '';
      // this.searchForm.array_status = params['array_status'] && params['array_status'] != undefined ? params['array_status'] : [];
      this.initActiveBoxSummary();
      // if (this.searchForm.action && this.searchForm.array_status.length > 0) {
      //   this.setActiveBoxSummary(this.searchForm.array_status, this.searchForm.action);
      // }
      if (!this.searchForm.action) {
        this.contentHeader.headerTitle = "Lịch sử đấu nối";
        this.contentHeader.breadcrumb.links[1] = "Lịch sử đấu nối";
      } else if (
        this.searchForm.action &&
        this.searchForm.action == this.listTaskAction.change_sim.value
      ) {
        this.contentHeader.headerTitle = "Yêu cầu đổi sim của đại lý";
        this.contentHeader.breadcrumb.links[1] = "Yêu cầu đổi sim của đại lý";
      } else if (
        this.searchForm.action &&
        this.searchForm.action == this.listTaskAction.new_sim.value
      ) {
        this.contentHeader.headerTitle = "Yêu cầu đấu sim mới của đại lý";
        this.contentHeader.breadcrumb.links[1] =
          "Yêu cầu đấu sim mới của đại lý";
      } else if (
        this.searchForm.action &&
        this.searchForm.action == this.listTaskAction.change_info.value
      ) {
        this.contentHeader.headerTitle = "Yêu cầu Cập nhật TTTB của đại lý";
        this.contentHeader.breadcrumb.links[1] =
          "Yêu cầu Cập nhật TTTB của đại lý";
      }
      this.list = [];
      this.getData();
    });
  }

  async modalOpen(modal, item = null, size: string = "xl", type = null) {
    if (item) {
      this.itemBlockUI.start();
      this.selectedItem = item;
      let check;
      if (
        item.status != this.taskTelecomStatus.STATUS_CANCEL &&
        item.status != this.taskTelecomStatus.STATUS_SUCCESS
      ) {
        if (type == "VERIFY_MSISDN") {
          const restask = await this.telecomService
            .taskDetail(item.id)
            .toPromise();
          let task = restask.data;
          let idNo = task.customer
            ? task.customer.people.identification_no
            : task.people.identification_no;
          this.telecomService
            .getMyGmobileNumber(idNo, { other_id_no: idNo })
            .subscribe((res) => {
              this.listSucessMsisdn = res.data.filter((x) => x.state == 1);
              try {
                this.itemBlockUI.stop();
                this.modalRef = this.modalService.open(modal, {
                  centered: true,
                  windowClass: "modal modal-primary",
                  size: size,
                  backdrop: "static",
                  keyboard: false,
                });
              } catch (error) {
                this.itemBlockUI.stop();
                return;
              }
            });
        } else {
          try {
            this.itemBlockUI.stop();
            this.modalRef = this.modalService.open(modal, {
              centered: true,
              windowClass: "modal modal-primary",
              size: size,
              backdrop: "static",
              keyboard: false,
            });
          } catch (error) {
            this.itemBlockUI.stop();
            return;
          }
        }
      } else {
        this.itemBlockUI.stop();
        this.modalRef = this.modalService.open(modal, {
          centered: true,
          windowClass: "modal modal-primary",
          size: size,
          backdrop: "static",
          keyboard: false,
        });
      }
    }
  }

  modalClose() {
    this.selectedItem = null;
    this.list = [];
    this.isSentOtp = false;
    this.formOTPMsisdn.otp = "";
    this.getData();
    this.modalRef.close();
  }

  modalViewAgentClose() {
    this.selectedAgent = null;
    this.getData();
    this.modalRef.close();
  }

  onSubmitExportExcelReport() {
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

    if (!daterangeString) {
      this.alertService.showError("Bạn cần chọn khoảng thời gian xuất excel");
      return;
    } else {
      const startDate = new Date(this.dateRange.startDate.toISOString());
      const endDate = new Date(this.dateRange.endDate.toISOString());
      const priorDate = new Date(startDate.setDate(startDate.getDate() + 90));
      if (endDate.getTime() > priorDate.getTime()) {
        this.alertService.showError("Chỉ xuất được tối đa trong 90 ngày");
        return;
      }
    }
    const data = {
      keysearch: this.searchForm.keysearch,
      status: this.searchForm.status,
      action: this.searchForm.action,
      date_range: this.searchForm.date_range,
    };
    
    this.telecomService.exportExcelReport(data).subscribe(
      (res) => {
        console.log(res);

        const newBlob = new Blob([res.body], { type: res.body.type });
        let url = window.URL.createObjectURL(newBlob);
        let a = document.createElement("a");
        document.body.appendChild(a);
        a.setAttribute("style", "display: none");
        a.href = url;
        a.download = "Báo cáo đấu nối";
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
      },
      (err) => {
        this.alertService.showError(err);
      }
    );
  }

  onGetAvaiable(modalToOpen) {}

  @HostListener("window:scroll", ["$event"])
  onWindowScroll($event) {
    if (
      this.isInViewport(this.listTaskItems.last.nativeElement) &&
      !this.isInViewEl
    ) {
      this.isInViewEl = true;
      this.searchForm.skip += 20;
      this.getData();
    } else if (!this.isInViewport(this.listTaskItems.last.nativeElement)) {
      this.isInViewEl = false;
    }
  }

  loadPage(page) {
    this.searchForm.page = page;
    this.router.navigate(["/sim-so/task"], { queryParams: this.searchForm });
  }

  viewDetailSummary(array_status, action) {
    this.searchForm.action = action;
    this.searchForm.array_status = array_status;
    this.router.navigate(["/telecom"], { queryParams: this.searchForm });
  }

  initActiveBoxSummary() {
    this.isActivedBoxChangeSimInit = false;
    this.isActivedBoxChangeSimProcessing = false;
    this.isActivedBoxNewInit = false;
    this.isActivedBoxNewProcessing = false;
    this.isActivedBoxUpdateInit = false;
    this.isActivedBoxUpdateProcessing = false;
  }

  setActiveBoxSummary(array_status, action) {
    if (action == this.listTaskAction.new_sim.value) {
      if (
        JSON.stringify(array_status) ==
        JSON.stringify([this.taskTelecomStatus.STATUS_NEW_ORDER + ""])
      ) {
        this.isActivedBoxNewInit = true;
      }
      if (
        JSON.stringify(array_status) ==
        JSON.stringify([
          this.taskTelecomStatus.STATUS_PROCESSING + "",
          "" + this.taskTelecomStatus.STATUS_PROCESS_TO_MNO,
        ])
      ) {
        this.isActivedBoxNewProcessing = true;
      }
    } else if (action == this.listTaskAction.change_info.value) {
      if (
        JSON.stringify(array_status) ==
        JSON.stringify([this.taskTelecomStatus.STATUS_NEW_ORDER + ""])
      ) {
        this.isActivedBoxChangeSimInit = true;
      }
      if (
        JSON.stringify(array_status) ==
        JSON.stringify([
          this.taskTelecomStatus.STATUS_PROCESSING + "",
          "" + this.taskTelecomStatus.STATUS_PROCESS_TO_MNO,
        ])
      ) {
        this.isActivedBoxChangeSimProcessing = true;
      }
    }
  }

  showDate(date, timeZone, diff) {
    if (!date) {
      return "";
    }
    let dateConverted = new Date(date);
    dateConverted.setMinutes(new Date(date).getMinutes() + diff);
    return formatDate(dateConverted, "dd/MM/yyyy H:mm", "en-US", timeZone);
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
    // this.searchForm.mine = this.mineTask ? 1 : '';
    this.router.navigate(["/telecom"], { queryParams: this.searchForm });
  }

  async onClickTask(item) {
    this.customer_id = item.customer_id;
    if (item.status == 4 || item.status == 40 || item.status == 0) {
      const rTask = await this.telecomService.taskDetail(item.id).toPromise();
      localStorage.setItem(
        ObjectLocalStorage.CURRENT_TASK,
        JSON.stringify(rTask.data)
      );
      if (item.action == this.listTaskAction.new_sim.value)
        this.router.navigate(["/telecom/new-sim", { step: 4 }]);
      else if (item.action == this.listTaskAction.change_sim.value)
        this.router.navigate(["/telecom/change-sim", { step: 3 }]);
      else if (item.action == this.listTaskAction.change_info.value) {
        this.router.navigate([
          "/telecom/update",
          { step: 2, id: item.id, customerId: item.customer_id },
        ]);
      }
    }
  }

  onUpdateSim(item) {
    if (item.action == "change_info") {
      this.router.navigate(["/telecom/update", { step: 2 }, this.customer_id]);
    }
  }

  async onCancelTask(item) {
    if (
      (
        await this.alertService.showConfirm(
          "Bạn có chắc chắn muốn hủy yêu cầu này không?"
        )
      ).value
    ) {
      this.itemBlockUI.start();
      this.telecomService.taskDelete(item.id).subscribe(
        (res) => {
          this.itemBlockUI.stop();
          if (!res.status) {
            this.alertService.showMess(res.message);
            return;
          }
          this.alertService.showSuccess(res.message);
          this.modalClose();
        },
        (error) => {
          this.itemBlockUI.stop();
          this.alertService.showMess(error);
          return;
        }
      );
    }
  }

  onUpdateStatusSuccess(eventData: { updated: boolean }) {
    if (eventData.updated) {
      this.list = [];
      this.getData();
      // this.modalRef.close();
    }
  }

  ngOnInit(): void {}

  getData() {
    this.currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (this.currentUser && this.currentUser.roles) {
    }
 
    this.telecomService.getAllTask(this.searchForm).subscribe((res) => {
      if (res.data.tasks.length > 0) {
        this.notData = true;
        Array.prototype.push.apply(this.list, res.data.tasks);
        this.list.sort((x, y) => {
          const timeX = new Date(x.request_time).getTime();
          const timeY = new Date(y.request_time).getTime();
          return timeY - timeX; // Sắp xếp theo giảm dần
        });
        this.totalItems = res.data.count;
        this.hasNextPage = res.data.hasNextPage;
        } else {
          this.hasNextPage = false;
             this.totalItems = 0;
        }
    });
    // this.telecomService.getSummary().subscribe(res => {
    //   this.summaryTask = res.data;
    // })
  }

  isInViewport(elm) {
    let elementTop = elm.getBoundingClientRect().top + window.scrollY;
    let elementBottom = elementTop + elm.offsetHeight;

    // in this specific case the scroller is document.documentElement (<html></html> node)
    let viewportTop = document.documentElement.scrollTop;
    let viewportBottom = viewportTop + document.documentElement.clientHeight;
    // console.log(elementTop, elementBottom, viewportTop, viewportBottom);
    return elementBottom > viewportTop && elementTop < viewportBottom;
  }

  async onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      this.fileContract = event.target.files[0];
    }
  }

  async onSubmitUpload() {
    let data = new FormData();
    data.append("task_id", this.selectedItem.id);
    data.append("identification_no", this.selectedItem.msisdn);
    data.append("hopdong", this.fileContract);

    if (
      (await this.alertService.showConfirm("Bạn có muốn tải hợp đồng lên"))
        .value
    ) {
      this.itemBlockUI.start();
      this.telecomService.uploadOganizationContract(data).subscribe(
        (res) => {
          this.itemBlockUI.stop();
          if (!res.status) {
            this.alertService.showMess(res.message);
            return;
          }
          this.alertService.showSuccess(res.message);
          this.modalClose();
        },
        (error) => {
          this.itemBlockUI.stop();
          this.alertService.showMess(error);
          return;
        }
      );
    }
  }

  async onSendOTPMsisdn() {
    let data = {
      mobile: this.formOTPMsisdn.mobile,
      task_id: this.selectedItem.id,
    };
    let res, resVerify;
    if (!this.isSentOtp) {
      if (!this.formOTPMsisdn.mobile) {
        this.alertService.showMess("Vui lòng chọn SĐT nhận OTP");
        return;
      }
      try {
        res = await this.telecomService.sendOTPMsisdn(data).toPromise();
        if (!res.status && res.code != "OTP_SENT") {
          this.alertService.showMess(res.message);
          return;
        }
        this.isSentOtp = true;
        return;
      } catch (error) {
        this.alertService.showMess(error);
      }
    }
    if (this.isSentOtp) {
      let data = {
        mobile: this.formOTPMsisdn.mobile,
        otp: this.formOTPMsisdn.otp,
        task_id: this.selectedItem.id,
      };
      try {
        resVerify = await this.telecomService.verifyOTPMsisdn(data).toPromise();
        if (!resVerify.status) {
          this.alertService.showMess(resVerify.message);
          return;
        }
        this.alertService.showSuccess(resVerify.message);
        this.modalClose();
      } catch (error) {
        this.alertService.showMess(error);
      }
    }
  }

  getDetailTask(detail, property: string) {
    let data = JSON.parse(detail);
    if (data) return data[property];
    return "";
  }
}
