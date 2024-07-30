import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PackagesService } from 'app/auth/service/packages.service';
import { SweetAlertService } from 'app/utils/sweet-alert.service';

@Component({
  selector: 'app-packages',
  templateUrl: './packages.component.html',
  styleUrls: ['./packages.component.scss']
})
export class PackagesComponent implements OnInit {

  @Output() nextStep = new EventEmitter<any>();
  @Output() selectPackage = new EventEmitter<any>();
  @Input() telco = null;
  public list;
  public currentSelectedPackage = 0;
  private currentPackage;

  constructor(
    private packageService: PackagesService,
    private alertService: SweetAlertService
  ) { }

  onNextStep() {
    if(!this.currentPackage) {
      this.alertService.showError("Vui lòng chọn gói cước");
      return;
    }
    this.nextStep.emit({ title: "Serial SIM", package: this.currentPackage, validate_step: true });
  }

  onSelectItem(item) {
    this.currentSelectedPackage = item.id;
    this.currentPackage = item.code;    
  }

  ngOnInit(): void {
    
  }

  ngOnChanges(): void {
    this.getData();
  }

  getData() {
    if(this.telco) {
      this.packageService.getAll({telco: this.telco}).subscribe(res => {
        this.list = res.data.packages;
      })
    }    
  }

}
