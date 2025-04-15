import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TelecomServivce } from 'app/auth/service';
import { SweetAlertService } from 'app/utils/sweet-alert.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-sms-history',
  templateUrl: './sms-history.component.html',
  styleUrls: ['./sms-history.component.scss']
})
export class SmsHistoryComponent implements OnInit {
  searchSim = "";
  data;
  none = false;
  @BlockUI("section-block") itemBlockUI: NgBlockUI;
  
  constructor(
    private telecomService: TelecomServivce,
    private alertService: SweetAlertService,
  ) { }

  ngOnInit(): void {
  }

  formatNumber(number: string): string {
    return number.replace(/[^\d]/g, "");
  }

  onInputChange(item: string) {
      this.searchSim = this.formatNumber(this.searchSim);
  }

  onSubmitSearch() {
    if (!this.searchSim) {
      this.alertService.showMess("Vui lòng không để trống số điện thoại");
      return;
    }
    const data = {
      mobile: this.searchSim
    };
    this.itemBlockUI.start();
    this.telecomService.postReceiverSms(data).subscribe(
      (res: any) => {
        if (res.status == 1) {
          this.none = true;
          this.data = res.data;
          this.itemBlockUI.stop();
        } else {
          this.itemBlockUI.stop();
          this.alertService.showMess(res.message);
        }
      },
      (error) => {
        this.itemBlockUI.stop();
        this.alertService.showError(error);
      }
    );
  }

}
