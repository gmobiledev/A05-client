import { Component, EventEmitter, HostListener, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { TelecomServivce } from 'app/auth/service';
import { LockMobileDto } from 'app/auth/service/dto/new-sim.dto';
import { ProductService } from 'app/auth/service/product.service';
import { ObjectLocalStorage } from 'app/utils/constants';
import { SweetAlertService } from 'app/utils/sweet-alert.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-list-number',
  templateUrl: './list-number.component.html',
  styleUrls: ['./list-number.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ListNumberComponent implements OnInit {

  @Output() lockMobile = new EventEmitter<any>();
  @Output() loadDone = new EventEmitter<any>();
  @Output() nextStep = new EventEmitter<any>();
  @Input() currentTaskId;
  @Input() isLoadData;
  @Input() currentStep;

  public list = [];
  public total:any;
  public searchForm: any = {
    keyword: '',
    page: 1,
  }
  public paramsSearch = {
    keysearch: '',
    brand: '',
    take: 25,
    skip: 0,
  }
  public page:number=1;
  public pageSize: number = 20;

  // public selectedSim = [];
  @BlockUI('section-block') sectionBlockUI: NgBlockUI;
  
  constructor(
    private telecomService: TelecomServivce,
    private productService: ProductService,
    private alertService :SweetAlertService,
  ) {  
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll($event) {
    if(this.currentStep && this.currentStep != undefined && this.currentStep == 1 && (window.innerHeight + window.scrollY + 2) >= document.body.offsetHeight) {
      this.paramsSearch.skip += 25;
      this.page++;
      this.getData();
    }
  }

  onSubmitSearch() {
    this.list = [];
    this.getData();
  }

  async onSelectSim(event, item) {
    // this.listSelected.emit({item: item, event: event});

    let data = new LockMobileDto();
    data.mobile = item.name
    if(this.currentTaskId) {
      data.task_id = this.currentTaskId;
    }

    //call api add mobile
    try {
      let res = await this.telecomService.taskCreate(data);
      if(!res.status) {
        this.alertService.showError(res.message);
        return;
      }

      this.nextStep.emit({ title: "Chọn gói cước", validate_step: true, mobile: item.name });
      this.lockMobile.emit({current_task: res.data, selected_telco: item.brand});
      localStorage.setItem(ObjectLocalStorage.CURRENT_SELECT_MOBILE, item.name);
      localStorage.setItem(ObjectLocalStorage.CURRENT_TASK, JSON.stringify(res.data));
    } catch (error) {      
      this.alertService.showError(error);
      return;
    }
    //end

    
    // this.selectedSim.push(item);
    
    // console.log(this.selectedSim);
    // this.listSelected.emit(this.selectedSim);
  }
  loadPage(page) { 
    console.log(page);     
    this.paramsSearch.skip = this.paramsSearch.take * (page - 1);
    this.page=page;
    this.getData();
    
  }
  ngOnInit(): void {
    this.list = [];
    this.getData();
  }
  ngOnChanges(): void {
    if(this.isLoadData) {
      this.list = [];
      this.getData();
    }
  }
  getData(): void {
    this.sectionBlockUI.start();

    this.productService.getAll(this.paramsSearch).subscribe(res => {
      if(res.data.products.length > 0) {
        Array.prototype.push.apply(this.list, res.data.products);
      }
      
      this.total= res.data.count;
      this.sectionBlockUI.stop();
      this.loadDone.emit({isLoadData: false});
    })
  }

}
