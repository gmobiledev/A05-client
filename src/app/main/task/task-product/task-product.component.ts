import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { TaskService } from 'app/auth/service/task.service';
import { SweetAlertService } from 'app/utils/sweet-alert.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as dayjs from 'dayjs';
import { UnitService } from 'app/auth/service/unit.service';

@Component({
  selector: 'app-task-product',
  templateUrl: './task-product.component.html',
  styleUrls: ['./task-product.component.scss']
})
export class TaskProductComponent implements OnInit {
  @ViewChild('modalUpdateSim') modalUpdateSim: any;
  @ViewChild('confirmUpdateModal', { static: true }) confirmUpdateModalRef!: TemplateRef<any>;

  public selectedSim: any;
  public modalRef: any;

  listUnit: any[] = [];
  listSellChannel: any[] = [];
  list: any[] = [];
  totalPage = 0;
  public totalItems: number;
  pendingUpdatePayload: any;

  updateSimForm: any = {
    code: '',
    name: '',
    phone: '',
    email: '',
    unit_id: '',
    note: '',
  };

  searchForm = {
    search: '',
    channelId: '',
    channelName: '',
    assignedUser: '',
    fromDate: '',
    toDate: '',
    take: 10,
    page: 1
  };

  dateRange: any;
  ranges: any = {
    'Hôm nay': [dayjs(), dayjs()],
    'Hôm qua': [dayjs().subtract(1, 'day'), dayjs().subtract(1, 'day')],
    '7 ngày qua': [dayjs().subtract(6, 'day'), dayjs()],
    'Tháng này': [dayjs().startOf('month'), dayjs().endOf('month')],
    'Tháng trước': [
      dayjs().subtract(1, 'month').startOf('month'),
      dayjs().subtract(1, 'month').endOf('month')
    ]
  };

  constructor(
    private readonly taskService: TaskService,
    private readonly alertService: SweetAlertService,
    private readonly modalService: NgbModal,
    private readonly unitService: UnitService,
  ) {}

  ngOnInit(): void {
      this.unitService.getAllUnits().subscribe(res => {
      this.listUnit = res.data || res;
    });
      this.taskService.listSellChannelAll().subscribe(res => {
      this.listSellChannel = [
        { id: '', name: 'Tất cả kho' },
        ...res.data.items
      ];
    });
    this.loadData();
  }

  onSubmitSearch() {
    if (this.dateRange?.startDate && this.dateRange?.endDate) {
      const tzoffset = new Date().getTimezoneOffset() * 60000;
      this.searchForm.fromDate = new Date(new Date(this.dateRange.startDate.toISOString()).getTime() - tzoffset)
        .toISOString();

      const endDateLocal = new Date(this.dateRange.endDate);
      endDateLocal.setHours(23, 59, 59, 999);
      this.searchForm.toDate = new Date(endDateLocal.getTime() - tzoffset).toISOString();
    } else {
      this.searchForm.fromDate = '';
      this.searchForm.toDate = '';
    }

    this.searchForm.page = 1;
    this.loadData();
  }

  loadData() {

    this.taskService.getAssignedNumbers(this.searchForm).subscribe(res => {
      this.list = res.data || [];
      this.totalPage = res.length || 0;
      this.totalItems = res.total
    });
  }

  openUpdateSimModal(modalTemplate: any, sim: any) {
    this.selectedSim = sim;

    this.updateSimForm = {
      code:  '',
      name:  '',
      phone:  '',
      email:  '',
      unit_id: null,
      note: '',
    };
    this.modalRef = this.modalService.open(modalTemplate, {
      centered: true,
      size: 'lg',
      backdrop: 'static',
      keyboard: false
    });
  }

  getUnitName(unit_id: number): string {
    const unit = this.listUnit.find(u => u.id === unit_id);
    return unit ? unit.name : 'Chưa có đơn vị';
  }

  openViewSimModal(modalTemplate: any, sim: any) {
    this.selectedSim = sim;

    this.modalRef = this.modalService.open(modalTemplate, {
      centered: true,
      size: 'lg',
      backdrop: 'static',
      keyboard: false
    });
  }

  closeModal() {
    this.modalRef.close();
    this.selectedSim = null;
    this.updateSimForm = {
      code: '',
      name: '',
      phone: '',
      email: '',
      unit_id: '',
      note: ''
    };
  }

  onSubmitUpdateSim() {
    if (
      !this.updateSimForm.code?.trim() ||
      !this.updateSimForm.name?.trim() ||
      !this.updateSimForm.phone?.trim() ||
      !this.updateSimForm.email?.trim() ||
      !this.updateSimForm.unit_id
    ) {
      this.alertService.showMess('Vui lòng nhập đầy đủ các trường bắt buộc trước khi cập nhật');
      return; 
    }
    this.pendingUpdatePayload = {
      product_id: this.selectedSim.product_id,
      serial: this.selectedSim.serial,
      employeeCode: this.updateSimForm.code,
      fullName: this.updateSimForm.name,
      mobile: this.updateSimForm.phone,
      email: this.updateSimForm.email,
      unit_id: this.updateSimForm.unit_id,
      note: this.updateSimForm.note
    };

    // Mở popup xác nhận
    this.modalService.open(this.confirmUpdateModalRef, {
      size: 'lg',
      centered: true,
      backdrop: 'static',
      keyboard: false
    });
  }

  confirmUpdate(modalRef: any) {
    modalRef.close();

    this.taskService.updateUser(this.pendingUpdatePayload).subscribe({
      next: () => {
        this.alertService.showMess('Cập nhật người sử dụng SIM thành công');
        this.closeModal();
        this.loadData();
      },
      error: (err) => {
        console.error(err);
        this.alertService.showMess('Cập nhật thất bại');
      }
    });
  }

  formatInput(target: any) {
  target.value = target.value.replace(/[^0-9]/g, '');
  }

  loadPage(page: any) {
    const parsed = parseInt(page, 10);
    if (!isNaN(parsed) && parsed > 0) {
      this.searchForm.page = parsed;
      this.loadData();
    }
  }

  exportExcel() {
    const params: any = {
      search: this.searchForm.search || '',
      channelName: this.searchForm.channelName || '',
      assignedUser: this.searchForm.assignedUser || '',
      fromDate: this.searchForm.fromDate || '',
      toDate: this.searchForm.toDate || ''
    };

    this.taskService.exportAssignedNumbersExcel(params).subscribe({
      next: (response) => {
        const blob = new Blob([response.body], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });

        // Nếu muốn lấy tên file từ header (nếu server set)
        const contentDisposition = response.headers.get('Content-Disposition');
        let fileName = 'danhsachso.xlsx';
        if (contentDisposition) {
          const match = contentDisposition.match(/filename="?([^"]+)"?/);
          if (match?.[1]) fileName = match[1];
        }

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      },
      error: (err) => {
        console.error(err);
        this.alertService.showMess('Xuất Excel thất bại');
      }
    });
  }

}
