import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { TelecomServivce } from 'app/auth/service';
import Quagga from 'quagga';
import { getMainBarcodeScanningCamera } from './camera-access';
import { SweetAlertService } from 'app/utils/sweet-alert.service';
import { ObjectLocalStorage, TelecomTaskSubAction } from 'app/utils/constants';
import { ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';
import {BarcodeFormat , MultiFormatReader, DecodeHintType, BrowserMultiFormatReader, RGBLuminanceSource, BinaryBitmap, HybridBinarizer} from '@zxing/library';
import { HTMLCanvasElementLuminanceSource } from '@zxing/browser';
import { Observable, ReplaySubject } from 'rxjs';
import { ScanSerialDto } from 'app/auth/service/dto/new-sim.dto';
import { BlockUI, NgBlockUI } from 'ng-block-ui';


@Component({
  selector: 'app-serial-sim',
  templateUrl: './serial-sim.component.html',
  styleUrls: ['./serial-sim.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SerialSimComponent implements OnInit {

  @Output() nextStep = new EventEmitter<any>();
  @Input() currentTaskId;
  @Input() selectedPackage;  
  @Input() selectedMobile;

  @ViewChild('imgToScan')
  imgToScan?: ElementRef

  public imgBarCode;
  public imgSource;

  public imageFront;

  imageChangedEvent;
  enableScanCode: boolean = false;
  isManualInputCode: boolean = false;
  isUseOCR: boolean = true;
  isPhotoTaken: boolean = false;
  isCropImage: boolean = false;

  started: boolean | undefined;
  errorMessage: string | undefined;
  acceptAnyCode = true;

  public listCamera;
  public scannerEnabled: boolean = true;
  public serialSim;
  public imageSim;

  public stream;

  public zoomValue = 1;
  public zoomMin = 1;
  public zoomMax = 3;

  private isScanSuccess: boolean = false;

  @BlockUI('section-block') sectionBlockUI: NgBlockUI;
  currentTask: any;

  constructor(
    private telecomService: TelecomServivce,
    private alertService: SweetAlertService,
    private changeDetectorRef: ChangeDetectorRef,
    private elRef: ElementRef
  ) { }

  async onNextStep() {
    //goi api add kit
    if (this.enableScanCode) {
      if (!this.isPhotoTaken) {
        this.onTakePhoto();
        return;
      }
      if (this.isPhotoTaken && !this.isCropImage) {
        this.onConfirmCropImage();
        return;
      }
      if (this.isCropImage && this.isPhotoTaken && !this.isScanSuccess) {
        const hints = new Map();
        const enabledFormats = [
          BarcodeFormat.CODE_128,
        ];
        hints.set(DecodeHintType.POSSIBLE_FORMATS, enabledFormats);
        const codeReader = new BrowserMultiFormatReader(hints);
        codeReader.decodeFromImage(undefined, this.imgBarCode).then((result: any) => {
          console.log(result)
          if (result && result.text) {
            this.serialSim = result.text;
            this.isScanSuccess = true;
            return;
          } else {
            this.alertService.showError("Chưa có kết quả serial SIM, vui lòng thử lại hoặc nhập tay");
            return;
          }
        })
          .catch((err) => {
            console.log(err);
            this.alertService.showError("Chưa có kết quả serial SIM, vui lòng thử lại hoặc nhập tay.");
            return;
          })
        return;
      }
    }    
    if (this.currentTask?.sub_action != TelecomTaskSubAction.BUY_ESIM &&  (!this.serialSim || !this.imageFront)) {
      this.alertService.showError("Vui lòng nhập serial SIM và tải ảnh SIM")
      return;
    }
    if((this.enableScanCode && this.isScanSuccess) || this.serialSim || this.currentTask?.sub_action == TelecomTaskSubAction.BUY_ESIM) {
      this.submitData();
    }    
  }

  onZoomInOut(value) {
    console.log(value);
    this.zoomValue = value;
    const track = Quagga.CameraAccess.getActiveTrack();    
    track.applyConstraints({ advanced: [{ zoom: this.zoomValue }] });
  }

  submitData() {
    if(this.enableScanCode) {
      let videoCamera = this.elRef.nativeElement.querySelector('video');
      if(videoCamera && !this.isManualInputCode) {
        let canvas = this.elRef.nativeElement.querySelector('canvas');
        let context = canvas.getContext('2d');
        console.log(videoCamera.videoHeight);
        console.log(videoCamera.videoWidth);
        context.drawImage(videoCamera, 0, 0, 1800, 1800);
        this.imageSim = this.dataURLtoFile(canvas.toDataURL('image/jpg'), `${this.serialSim}.png`);
      } else {
        this.imageSim = this.dataURLtoFile(this.imgBarCode, `${this.serialSim}.png`);
      }   
    } else {
      this.imageSim = this.imageFront ? this.dataURLtoFile('data:image/png;base64,'+this.imageFront, `${this.serialSim}.png`) : null;
    }
     
    let formData = new FormData();
    formData.append("task_id", this.currentTaskId);
    formData.append("mobile", this.selectedMobile);
    formData.append("package", this.selectedPackage);
    if(this.serialSim) {
      formData.append("serial", this.serialSim);
    }
    if(this.imageSim) {
      formData.append("sim_file", this.imageSim);
    }
        
    this.stopCameraStream();
    this.telecomService.taskAddKit(formData).subscribe(res => {
      if (!res.status) {
        this.alertService.showError(res.message);
        return;
      }
      localStorage.removeItem(ObjectLocalStorage.CURRENT_SELECT_MOBILE);
      console.log('currentTask', this.currentTask);
      
      if(this.currentTask?.sub_action != TelecomTaskSubAction.BUY_ESIM) {
        this.nextStep.emit({ title: "Đơn hàng", validate_step: true, reload_data: true, load_cart: true });
      } else {
        this.nextStep.emit({ title: "Đơn hàng", validate_step: true, reload_data: true, load_cart: true, step: 4 });
      }
      
    }, error => {
      this.alertService.showError(error);
      return;
    })
  }

  async initCamera() {
    this.isPhotoTaken = false;
    this.isCropImage = false;
    let constraints = {
      audio: false,
      video: {
        width: { ideal: 1800 },
        height: { ideal: 1800 },
        facingMode: {
          exact: 'environment'
        }
      }
    };
    this.stream = await navigator.mediaDevices.getUserMedia(constraints);
    let videoCamera = this.elRef.nativeElement.querySelector('video');
    videoCamera.setAttribute('autoplay', '');
    videoCamera.setAttribute('muted', '');
    videoCamera.setAttribute('playsinline', '');
    videoCamera.setAttribute('webkit-playsinline', '');
    videoCamera.srcObject  = this.stream;

    //scan code
    const hints = new Map();
    const enabledFormats = [
      BarcodeFormat.CODE_128,
    ];
    hints.set(DecodeHintType.POSSIBLE_FORMATS, enabledFormats);
    const codeReader = new BrowserMultiFormatReader(hints);
    codeReader.decodeOnceFromVideoDevice(undefined, 'video-scan').then((result: any) => {
      console.log(result);
      if(result && result.text) {
        this.serialSim = result.text;
        this.submitData();
      }
    }).catch((err) => {
      console.error(err)
    })
  }

  onTakePhoto() {   
    let videoCamera = this.elRef.nativeElement.querySelector('video');
    let canvas = this.elRef.nativeElement.querySelector('canvas');
    let context = canvas.getContext('2d');
    console.log(videoCamera.videoHeight);
    console.log(videoCamera.videoWidth);
    context.drawImage(videoCamera, 0, 0, 1800, 1800);
    this.imgSource = canvas.toDataURL('image/jpg');
    this.isPhotoTaken = true;
    this.stopCameraStream();
  }

  stopCameraStream() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
    }
  }
  
  onReScan(): void {
    this.imgBarCode = null;
    this.serialSim = '';
    this.imgSource = null;
    this.isPhotoTaken = false;
    this.isCropImage = false;
    this.isScanSuccess = false;
    this.initCamera();
  }

  onConfirmCropImage() {
    this.isCropImage = true;
  }

  imageCropped(event: ImageCroppedEvent) {
    console.log(event);
    this.imgBarCode = event.base64;
  }
  imageLoaded(image: LoadedImage) {
    // show cropper
  }
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }

  // Bỏ scan code, chỉ nhập số serial và up ảnh
  // Nếu sử dụng OCR, bóc text từ ảnh và gọi api submit add kit
  onSelectFile(event) {
    this.convertFile(event.target.files[0]).subscribe(async base64 => {
      this.imageFront = base64;
      if(this.isUseOCR) {
        this.sectionBlockUI.start();
        const dataOcr = new ScanSerialDto();
        dataOcr.fileBase64 = base64;
        dataOcr.object_detect = 'SIM_SERIAL';
        try {
          const resultOCR = await this.telecomService.taskScanSerial(dataOcr).toPromise();
          this.sectionBlockUI.stop();
          if(resultOCR.status && resultOCR.data) {
            this.serialSim = resultOCR.data;
            this.submitData();
          }
        } catch (error) {
          this.sectionBlockUI.stop();
        }
        
      }
      
    });
  }

  onReUpload() {
    this.imageFront = null;
  }

  convertFile(file: File): Observable<string> {
    const result = new ReplaySubject<string>(1);
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = (event) => result.next(btoa(event.target.result.toString()));
    return result;
  }

  initFormData() {
    this.serialSim = '';
    this.imageFront = null;
  }


  ngOnInit(): void {
    this.initFormData();
  }

  ngAfterViewInit(): void {
    
  }

  ngOnChanges(): void {
    if(this.selectedPackage && this.selectedPackage != 'skip') {
      console.log(123123);
      
      if (!navigator.mediaDevices || !(typeof navigator.mediaDevices.getUserMedia === 'function')) {
        this.errorMessage = 'getUserMedia is not supported';
        return;
      }
      this.initFormData();
      console.log('enableScanCode', this.enableScanCode);
      
      if(this.enableScanCode) {
        this.initCamera();
      }      
      this.currentTask = JSON.parse(localStorage.getItem(ObjectLocalStorage.CURRENT_TASK));
      if( this.currentTask?.sub_action == TelecomTaskSubAction.BUY_ESIM) {
        this.submitData();
      }
    }
    if(this.selectedPackage == 'skip'){
      localStorage.removeItem(ObjectLocalStorage.CURRENT_SELECT_MOBILE);
        this.nextStep.emit({ title: "Đơn hàng", validate_step: true, reload_data: true, load_cart: true, step: 4 });
    }
  }

  private dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  }

}
