import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { TelecomServivce } from 'app/auth/service';
import { RemoveNumberDto } from 'app/auth/service/dto/new-sim.dto';
import { ObjectLocalStorage } from 'app/utils/constants';
import { SweetAlertService } from 'app/utils/sweet-alert.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  @Output() nextStep = new EventEmitter<any>();
  @Output() toNStep = new EventEmitter<any>();
  @Input() currentTaskId;
  @Input() state;
  public taskDetail;
  public totalMoney = 0;

  constructor(
    private telecomService: TelecomServivce,
    private alertService: SweetAlertService,
  ) { }

  async onNextStep() {
    const listUncompleteMsisdn = this.taskDetail.msisdns.filter(item => { return (!item.serial || !item.package) });
    if(listUncompleteMsisdn.length > 0) {
      if ((await this.alertService.showConfirm(`Số ${listUncompleteMsisdn[0].msisdn} chưa chọn gói cước và SIM`, "Vui lòng cập nhật thêm thông tin", "Cập nhật", "Bỏ qua")).value) {
        this.toNStep.emit({step: 2, clear_data: false, selected_mobile: listUncompleteMsisdn[0].msisdn, telco: listUncompleteMsisdn[0].mno });
      }
    } else {
      this.nextStep.emit({ title: "Chụp ảnh giấy tờ", validate_step: true });
    }    
  }

  onEditSerial(item) {
    this.toNStep.emit({step: 2, clear_data: false, selected_mobile: item.msisdn, telco: item.mno });
  }

  async onRemoveNumber(item) {
    let data = new RemoveNumberDto();
    data.task_id = this.currentTaskId;
    data.mobile = item;
    if ((await this.alertService.showConfirm("Bạn có đồng ý bỏ số " + item + " khỏi giỏ hàng")).value) {
      this.telecomService.taskRemoveMobile(data).subscribe(async res => {
        if(!res.status) {
          this.alertService.showError(res.message);
          return;
        }  
        this.alertService.showSuccess(res.message);
        await this.getData();
        if(this.taskDetail.msisdns.length < 1) {
          this.telecomService.taskDelete(this.currentTaskId).subscribe(res => {
            
          })
          await this.emptyDataTask();
          this.toNStep.emit({step: 1, clear_data: true});
        } 
      }, error => {
        this.alertService.showError(error);
      })
    }
    
  }

  async onCancelTask(id) {    
    if ((await this.alertService.showConfirm("Bạn có đồng ý hủy đơn?")).value) {
      this.telecomService.taskDelete(this.currentTaskId).subscribe(res => {
        if(!res.status) {
          this.alertService.showError(res.message);
          return;
        }
        
        this.alertService.showSuccess(res.message);
        this.emptyDataTask();
        this.toNStep.emit({step: 1, clear_data: true});
      })
    }
  }

  onToFirstStep() {
    this.toNStep.emit({step: 1, clear_data: false});
  }

  emptyDataTask() {
    localStorage.removeItem(ObjectLocalStorage.CURRENT_TASK);
    localStorage.removeItem(ObjectLocalStorage.CURRENT_PEOPLE_INFO_NEW_SIM);
    localStorage.removeItem(ObjectLocalStorage.CURRENT_SELECT_MOBILE);
  }

  ngOnInit(): void {
    this.getData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(!changes['state'].isFirstChange()) {
      this.getData();
    }    
    console.log('aaaa545454', this.currentTaskId, changes);
  }

  async getData() {
    this.totalMoney = 0;
    if(this.currentTaskId) {
      let res;
      try {
        res = await this.telecomService.taskDetail(this.currentTaskId).toPromise();
        if(res.status) {
          this.taskDetail = res.data;
          localStorage.setItem(ObjectLocalStorage.CURRENT_TASK,JSON.stringify(this.taskDetail));
          for (let i = 0;i<res.data.msisdns.length; i++) {
            this.totalMoney += res.data.msisdns[i].amount;
          }
        }
      } catch (error) {
        this.taskDetail = null;
      }
      
    } else {
      this.taskDetail = null;
    }
  }

}
