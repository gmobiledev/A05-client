import { Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TelecomServivce } from 'app/auth/service';
import { LockMobileDto } from 'app/auth/service/dto/new-sim.dto';
import { GSubService } from 'app/auth/service/gsub.service';
import { ObjectLocalStorage, TaskTelecomStatus } from 'app/utils/constants';
import { SweetAlertService } from 'app/utils/sweet-alert.service';
import Stepper from 'bs-stepper';
import { SubscriptionLike } from 'rxjs';

@Component({
  selector: 'app-new-sim',
  templateUrl: './new-sim.component.html',
  styleUrls: ['./new-sim.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NewSimComponent implements OnInit, OnDestroy {

  // public
  public contentHeader: object;
  public selectedSim = [];

  public selectedTelco = '';
  public selectedPackage = '';
  public selectedMobile = '';
  public getDataPeople: boolean = false;
  public showPopupSignature: boolean = false;
  public currentContract = '';
  public identification_front_file;
  public identification_back_file;
  public currentFileId;
  public personal = true
  public isDelegation = false

  public totalPhihoamang: number = 0;
  public totalCuoc: number = 0;
  public totalPrice: number = 0;
  public currentTitle = "Chọn số";
  public currentTask;
  public currentStep = 1;

  public reloadData: boolean = false;
  public isLoadData: boolean = false;
  public stateCart = '';

  // private
  private horizontalWizardStepper: any;
  private validateStep: boolean = false;
  private bsStepper;
  subscription: SubscriptionLike;


  @ViewChild('myModal') public myModal: ElementRef | undefined;
  public modalRef: any;


 
  horizontalWizardStepperNext(data) {
    if (data && data.title) {
      this.currentTitle = data.title;
    }
    if (data.reload_data) {
      this.reloadData = data.reload_data;
      if (this.horizontalWizardStepper._currentIndex == 2 || data.load_cart) {
        this.stateCart = !this.stateCart ? 'change' : '';
      }
    }
    if (data.package) {
      this.selectedPackage = data.package;
    }
    if (data.mobile) {
      this.selectedMobile = data.mobile;
    }
    if (data.get_data_people) {
      this.getDataPeople = data.get_data_people;
    }
    if (data.doc_contract) {
      this.currentContract = data.doc_contract;
    }
    if (data.file_id) {
      this.currentFileId = data.file_id;
    }
    if (data.personal === false && this.personal)
      this.personal = false;
    else if (data.personal === true && !this.personal)
      this.personal = true;

    if (data.isDelegation === true)
      this.isDelegation = true

    this.identification_front_file = data.identification_front_file ? data.identification_front_file : null;
    this.identification_back_file = data.identification_back_file ? data.identification_back_file : null;
    if (data.validate_step && !data.step) {
      this.horizontalWizardStepper.next();
    } 
    if (data.validate_step && data.step) {
      this.horizontalWizardStepper.to(data.step);
    }

    this.currentStep = this.horizontalWizardStepper._currentIndex + 2;
    if (this.horizontalWizardStepper._currentIndex == 7) {
      const bodyElement = document.body;
      if (bodyElement) {
        bodyElement.classList.add('disable-pull-refresh');
      }
      this.showPopupSignature = true;
      this.modalRef = this.modalService.open(this.myModal, {
        size: 'xl',
        centered: true,
        backdrop: 'static'
      });
    }
  }

  horizontalWizardStepperPrevious() {

    this.horizontalWizardStepper.previous();
    this.currentStep = this.horizontalWizardStepper._currentIndex;
    if (this.horizontalWizardStepper._currentIndex == 1) {
      this.currentTitle = 'Chọn số';
    }
    if (this.horizontalWizardStepper._currentIndex == 2) {
      this.currentTitle = 'Chọn gói cước';
    }
    if (this.horizontalWizardStepper._currentIndex == 3) {
      this.currentTitle = 'Serial SIM';
    }
    if (this.horizontalWizardStepper._currentIndex == 4) {
      this.currentTitle = 'Đơn hàng';
    }
    if (this.horizontalWizardStepper._currentIndex == 5) {
      this.currentTitle = 'Chụp ảnh giấy tờ';
      this.getDataPeople = false;
    }
    if (this.horizontalWizardStepper._currentIndex == 6) {
      this.currentTitle = 'Xác nhận thông tin';
    }
    if (this.horizontalWizardStepper._currentIndex == 7) {
      this.currentTitle = 'Chân dung khách hàng';
    }
    if (this.horizontalWizardStepper._currentIndex == 8) {
      this.currentTitle = 'Phiếu yêu cầu/hợp đồng';
    }
    if (this.horizontalWizardStepper._currentIndex == 9) {
      this.currentTitle = 'Chữ ký khách hàng';
    }

    if (this.horizontalWizardStepper._currentIndex != 8) {
      const bodyElement = document.body;
      if (bodyElement) {
        bodyElement.classList.remove('disable-pull-refresh');
      }
    }
  }

  onSelectPackage(selected) {
    this.selectedPackage = selected.package;
  }

  /**
   * On Submit
   */
  onSubmit() {
    alert('Submitted!!');
    return false;
  }

  onToStep(data) {
    console.log(data);
    this.currentStep = data.step;
    if (data.step === 1) {
      this.isLoadData = true;
      this.selectedMobile = null;
      this.selectedPackage = null;
      this.stateCart = this.stateCart ? '' : 'change';
      if (data.clear_data) {
        this.currentTask = null;
        this.router.navigate(['/telecom/new-sim'])
      }
    }
    if (data.selected_mobile) {
      this.selectedMobile = data.selected_mobile;
    }
    if (data.telco) {
      this.selectedTelco = data.telco;
    }
    if (data.step != 9) {
      const bodyElement = document.body;
      if (bodyElement) {
        bodyElement.classList.remove('disable-pull-refresh');
      }
      if (this.modalRef && this.modalRef != undefined) {
        this.modalRef.close();
      }
    }
    if (data.step == 1) {
      this.currentTitle = 'Chọn số';
    }
    if (data.step == 2) {
      this.currentTitle = 'Chọn gói cước';
    }
    if (data.step == 3) {
      this.currentTitle = 'Serial SIM';
    }
    if (data.step == 4) {
      this.currentTitle = 'Đơn hàng';
      this.stateCart = !this.stateCart ? 'change' : '';
    }
    if (data.step == 5) {
      this.currentTitle = 'Chụp ảnh giấy tờ';
    }
    if (data.step == 6) {
      this.currentTitle = 'Xác nhận thông tin';
    }
    if (data.step == 7) {
      this.currentTitle = 'Chân dung khách hàng';
    }
    if (data.step == 8) {
      this.currentTitle = 'Phiếu yêu cầu/hợp đồng';
    }
    if (data.step == 9) {
      this.currentTitle = 'Chữ ký khách hàng';
    }
    this.horizontalWizardStepper.to(data.step);
  }

  onChildLoadDone(data) {
    this.isLoadData = data.isLoadData;
  }

  onLockMobile(data) {
    this.currentTask = data.current_task ? data.current_task : null;
    this.selectedTelco = data.selected_telco ? data.selected_telco : null;
  }

  constructor(
    private elRef: ElementRef,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private modalService: NgbModal,
    private alertService: SweetAlertService,
    private telecomService: TelecomServivce,
    private gsubService: GSubService
  ) {
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On Init
   */
  async ngOnInit() {
    const currentUser = JSON.parse(localStorage.getItem(ObjectLocalStorage.CURRENT_USER) || null);
    if (currentUser && (!isNaN(parseInt(currentUser.full_name)) || !currentUser.full_name)) {
      if ((await this.alertService.showConfirm("Vui lòng cập nhật thông tin cá nhân để tiếp tục", "", "Cập nhật", "Bỏ qua")).value) {
        this.router.navigate(['/profile/user-info']);
      } else {
        this.router.navigate(['/dashboard/home']);
      }
    }
    this.horizontalWizardStepper = new Stepper(document.querySelector('#stepper1'), {
      linear: false,
      animation: true
    });

    this.bsStepper = document.querySelectorAll('.bs-stepper');

    //kiem tra xem co dang o step
    const step = this.activeRoute.snapshot.paramMap.get('step');
    if (step !== null && step != undefined) {
      this.onToStep({ step: step });
      this.currentTask = JSON.parse(localStorage.getItem(ObjectLocalStorage.CURRENT_TASK || null));
      if(this.currentTask && this.currentTask.customer &&this.currentTask.customer.people
          && this.currentTask.action == 'new_sim') {
          delete this.currentTask.customer.people['identification_back_file'];
          delete this.currentTask.customer.people['identification_front_file'];
          delete this.currentTask.customer.people['identification_selfie_file'];
          delete this.currentTask.customer.people['identification_signature_file'];
          localStorage.setItem(ObjectLocalStorage.CURRENT_PEOPLE_INFO_NEW_SIM, JSON.stringify(this.currentTask.customer.people));
        
      }
      
    }

    //kiem tra co dang chon so nao ko
    this.selectedMobile = localStorage.getItem(ObjectLocalStorage.CURRENT_SELECT_MOBILE || null);

    if(!this.currentTask) {
      let res = await this.telecomService.taskList({ status: 0, take: 1, action: 'new_sim' });
      if (res.status && res.data && res.data.tasks.length > 0) {
        this.currentTask = res.data.tasks[0];
        localStorage.setItem(ObjectLocalStorage.CURRENT_TASK, JSON.stringify(this.currentTask));
      }
    }    

    //hien thi thong tin "có giỏ hàng chưa hoàn tất"
    if (this.currentTask && (this.currentTask.status == 0 || this.currentTask.status == undefined)) {
      const rTask = await this.telecomService.taskDetail(this.currentTask.id).toPromise();
      if (rTask.data.status == 0) {
        if ((await this.alertService.showConfirm("Bạn có giỏ hàng mã " + this.currentTask.id + " chưa hoàn tất", "Vui lòng cập nhật thêm thông tin", "Cập nhật", "Bỏ qua")).value) {
          this.onToStep({ step: 4 });
        } else {
          this.currentTask = null;
          localStorage.removeItem(ObjectLocalStorage.CURRENT_TASK);
          localStorage.removeItem(ObjectLocalStorage.CURRENT_PEOPLE_INFO_NEW_SIM);
        }
      } else {
        this.currentTask = null;
        localStorage.removeItem(ObjectLocalStorage.CURRENT_TASK);
        localStorage.removeItem(ObjectLocalStorage.CURRENT_PEOPLE_INFO_NEW_SIM);
      }
    }

    // content header
    this.contentHeader = {
      headerTitle: 'Mua số',
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
            name: 'Mua số',
            isLink: false
          }
        ]
      }
    };
    //pubsub
    this.subscription = this.gsubService.taskObservable.subscribe(res => {
      this.currentTask = res;
   
      console.log("Subs------",res);
    })

  }

  ngOnDestroy() {
    // unsubscribe
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
