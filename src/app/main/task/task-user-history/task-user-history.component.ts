import { Component, OnInit, ViewChild } from '@angular/core';
import { TaskService } from 'app/auth/service/task.service';
import { UnitService } from 'app/auth/service/unit.service';
import { SweetAlertService } from 'app/utils/sweet-alert.service';
import * as dayjs from 'dayjs';

@Component({
  selector: 'app-task-user-history',
  templateUrl: './task-user-history.component.html',
  styleUrls: ['./task-user-history.component.scss']
})
export class TaskUserHistoryComponent implements OnInit {

  public selectedSim: any;
  public modalRef: any;
  listSellChannel: any[] = [];

  listUnit: any[] = [];
  list: any[] = [];
  totalPages = 0;
  totalItems: 0;
  length: 0;

  searchForm = {
    channel_name: '',
    channel_id: '',
    phone_or_serial: '',
    old_user_name: '',
    new_user_name: '',
    from_date: '',
    to_date: '',
    limit: 10,
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
      this.searchForm.from_date = new Date(new Date(this.dateRange.startDate.toISOString()).getTime() - tzoffset)
        .toISOString();

      const endDateLocal = new Date(this.dateRange.endDate);
      endDateLocal.setHours(23, 59, 59, 999);
      this.searchForm.to_date = new Date(endDateLocal.getTime() - tzoffset).toISOString();
    } else {
      this.searchForm.from_date = '';
      this.searchForm.to_date = '';
    }

    this.searchForm.page = 1;
    this.loadData();
  }

  loadData() {
    this.taskService.getSimTransferHistory(this.searchForm).subscribe(res => {
    const wrapped = res?.data?.data ? res.data : res;
    this.list = wrapped?.data || [];
    this.totalItems = wrapped?.total || 0;
    this.totalPages = Math.ceil(this.totalItems / this.searchForm.limit);
    this.length = wrapped?.length || 0;
    });
    
  }

  formatInput(target: any) {
  target.value = target.value.replace(/[^0-9]/g, '');
  }

  loadPage(page: any) {
    const parsed = parseInt(page, 10);
    if (!isNaN(parsed) && parsed > 0 && parsed <= this.totalPages) {
      this.searchForm.page = parsed;
      this.loadData();
    }
  }

    exportExcel() {
    const params = {
      phone_or_serial: this.searchForm.phone_or_serial || '',
      old_user_name: this.searchForm.old_user_name || '',
      new_user_name: this.searchForm.new_user_name || '',
      from_date: this.searchForm.from_date || '',
      to_date: this.searchForm.to_date || '',
      page: this.searchForm.page || 1,
      limit: this.searchForm.limit || 10 
    };

    this.taskService.exportSimTransferHistoryExcel(params).subscribe({
      next: (response) => {
        const blob = new Blob([response.body], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });

        const contentDisposition = response.headers.get('Content-Disposition');
        let fileName = 'lichsuchuyenchu.xlsx';
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

   getUnitName(unit_id: number): string {
    const unit = this.listUnit.find(u => u.id === unit_id);
    return unit ? unit.name : 'Chưa có đơn vị';
  }
}
