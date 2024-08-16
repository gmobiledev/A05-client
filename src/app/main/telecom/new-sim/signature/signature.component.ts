import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Sanitizer, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TelecomServivce } from 'app/auth/service';
import { SignatureEkycDto } from 'app/auth/service/dto/new-sim.dto';
import { ObjectLocalStorage } from 'app/utils/constants';
import { SweetAlertService } from 'app/utils/sweet-alert.service';
import { fromEvent, Observable, merge } from 'rxjs';
import { concatMap, pairwise, switchMap, takeUntil, tap } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';

export enum Direction {
  up,
  left,
  down,
  right
}

export const DistanceConfig = {
  up: {
    x: 0,
    y: 10
  },
  left: {
    x: -10,
    y: 0
  },
  down: {
    x: 0,
    y: -10
  },
  right: {
    x: 10,
    y: 0
  }
};

@Component({
  selector: 'app-signature',
  templateUrl: './signature.component.html',
  styleUrls: ['./signature.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SignatureComponent implements OnInit {

  @Output() nextStep = new EventEmitter<any>();
  @Output() toNStep = new EventEmitter<any>();  
  @Input() currentTaskId;
  @Input() showPopupSignature;

  @ViewChild('myCanvas') public myCanvas: ElementRef | undefined;
  @ViewChild('modalQR') public modalQR: ElementRef | undefined;
  @Input() public width = 300;
  @Input() public height = 300;

  imgSignature;
  public modalRef: any;
  
  private cx: CanvasRenderingContext2D | null | undefined;
  isSubmitSignature: boolean = false;
  isCompleteTask: boolean = false;
  imgQrEsim;

  constructor(
    private modalService: NgbModal,
    private telecomService: TelecomServivce,
    private alertService: SweetAlertService,
    private sanitizer: DomSanitizer
  ) {

  }
  ngOnInit(): void {

  }

  ngOnChanges(): void {
    
  }

  onNextStep() {
    const canvasEl: HTMLCanvasElement = this.myCanvas?.nativeElement;
    const isBlank = this.isCanvasBlank(canvasEl);
    if(isBlank) {
      this.alertService.showError("Vui lòng điền chữ ký");
      return;
    }
    this.imgSignature = canvasEl.toDataURL('image/jpg').replace("data:image/png;base64,", "");
    let data = new SignatureEkycDto();
    data.task_id = this.currentTaskId;
    data.signature = this.imgSignature;
    this.telecomService.taskSignatureEkyc(data).subscribe(res => {
      if(!res.status) {
        this.alertService.showError(res.message);
        return;
      }
      this.isSubmitSignature = true;
      const qrEsim = localStorage.getItem(ObjectLocalStorage.ESIMQR);
            
      localStorage.removeItem(ObjectLocalStorage.CURRENT_PEOPLE_INFO_NEW_SIM);
      localStorage.removeItem(ObjectLocalStorage.CURRENT_TASK);
      localStorage.removeItem(ObjectLocalStorage.CURRENT_SELECT_MOBILE);
      
      if(qrEsim) {
        this.showPopupSignature = false;
        this.imgQrEsim = this.sanitizer.bypassSecurityTrustResourceUrl(qrEsim);
        this.modalRef = this.modalService.open(this.modalQR, {
          centered: true,
          windowClass: 'modal modal-primary',
          size: 'sm',
          backdrop: 'static',
          keyboard: false
        });            
      } else {
        this.alertService.showSuccess(res.message);
        this.toNStep.emit({step: 1, clear_data: true});
      }
      
    }, error => {
      this.alertService.showError(error);
      return;
    })  
  }
  
  modalQRClose() {
    this.isCompleteTask = true;
    localStorage.removeItem(ObjectLocalStorage.ESIMQR);
    this.modalRef.close();
    this.toNStep.emit({step: 1, clear_data: true});
  }

  public ngAfterViewInit() {
    if(this.showPopupSignature) {
      
      const canvasEl: HTMLCanvasElement = this.myCanvas?.nativeElement;

      this.cx = canvasEl.getContext('2d');

      canvasEl.width = this.width;
      canvasEl.height = this.height;

      if (!this.cx) throw 'Cannot get context';

      this.cx.lineWidth = 3;
      this.cx.lineCap = 'round';
      this.cx.strokeStyle = '#000';

      const mouseDowns = fromEvent(canvasEl, "mousedown");
      const mouseMoves = fromEvent(canvasEl, "mousemove");
      const mouseUps = fromEvent(canvasEl, "mouseup");

      const touchStarts = fromEvent(canvasEl, "touchstart");
      const touchMoves = fromEvent(canvasEl, "touchmove");
      const touchEnds = fromEvent(canvasEl, "touchend");

      let starts = merge(mouseDowns, touchStarts);
      let moves = merge(mouseMoves, touchMoves);
      let ends = merge(mouseUps, touchEnds);

      this.captureEvents(canvasEl, starts, moves, ends);
    }
  }

  private captureEvents(canvasEl, starts, moves, ends) {
    // this will capture all mousedown events from the canvas element
    starts
      .pipe(
        switchMap(e => {
          // after a mouse down, we'll record all mouse moves
          return moves.pipe(
            // we'll stop (and unsubscribe) once the user releases the mouse
            // this will trigger a 'mouseup' event
            takeUntil(ends),
            // we'll also stop (and unsubscribe) once the mouse leaves the canvas (mouseleave event)
            // takeUntil(fromEvent(canvasEl, 'mouseleave')),
            // pairwise lets us get the previous value to draw a line from
            // the previous point to the current point
            pairwise()
          );
        })
      )
      .subscribe((res) => {
        const rect = canvasEl.getBoundingClientRect();
        const prevMouseEvent = res[0] ;
        const currMouseEvent = res[1] ;

        // previous and current position with the offset
        const prevPos = prevMouseEvent.constructor.name == 'TouchEvent' ? {
          x: prevMouseEvent.changedTouches[0].clientX - rect.left,
          y: prevMouseEvent.changedTouches[0].clientY - rect.top
        } :  {
          x: prevMouseEvent.clientX - rect.left,
          y: prevMouseEvent.clientY - rect.top
        };

        const currentPos = currMouseEvent.constructor.name == 'TouchEvent' ? {
          x: currMouseEvent.changedTouches[0].clientX - rect.left,
          y: currMouseEvent.changedTouches[0].clientY - rect.top
        } : {
          x: currMouseEvent.clientX - rect.left,
          y: currMouseEvent.clientY - rect.top
        };

        // this method we'll implement soon to do the actual drawing
        this.drawOnCanvas(prevPos, currentPos);
      });
  }

  private drawOnCanvas(
    prevPos: { x: number; y: number },
    currentPos: { x: number; y: number }
  ) {
    if (!this.cx) {
      return;
    }

    this.cx.beginPath();

    if (prevPos) {
      this.cx.moveTo(prevPos.x, prevPos.y); // from
      this.cx.lineTo(currentPos.x, currentPos.y);
      this.cx.stroke();
    }
  }

  onClearDraw() {
    this.cx.clearRect(0, 0, this.width, this.height);
  }

  private isCanvasBlank(canvas) {
    const context = canvas.getContext('2d');
  
    const pixelBuffer = new Uint32Array(
      context.getImageData(0, 0, canvas.width, canvas.height).data.buffer
    );
  
    return !pixelBuffer.some(color => color !== 0);
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
