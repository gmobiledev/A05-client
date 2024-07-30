import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { TelecomServivce } from 'app/auth/service';
import { SignatureEkycDto } from 'app/auth/service/dto/new-sim.dto';
import { ObjectLocalStorage } from 'app/utils/constants';
import { SweetAlertService } from 'app/utils/sweet-alert.service';
import { fromEvent, Observable, merge } from 'rxjs';
import { concatMap, pairwise, switchMap, takeUntil, tap } from 'rxjs/operators';

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
  selector: 'app-signature-shared',
  templateUrl: './signature.component.html',
  styleUrls: ['./signature.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SignatureSharedComponent implements OnInit {



  @ViewChild('myCanvas') public myCanvas: ElementRef | undefined;

  @Input() public width = 600;
  @Input() public height = 400;
  @Output() outSignatureBase64 = new EventEmitter<any>();

  imgSignature;

  private cx: CanvasRenderingContext2D | null | undefined;

  constructor(
    private telecomService: TelecomServivce,
    private alertService: SweetAlertService
  ) {

  }
  ngOnInit(): void {

  }

  ngOnChanges(): void {
  }

  onNextStep() {
    const canvasEl: HTMLCanvasElement = this.myCanvas?.nativeElement;
    if(this.isCanvasBlank(canvasEl)) {
      this.alertService.showError("Vui lòng ký tên");
      return;
    }
    this.imgSignature = canvasEl.toDataURL('image/jpg').replace("data:image/png;base64,", "");
    this.outSignatureBase64.emit(this.imgSignature);
  }

  private isCanvasBlank(canvas) {
    const context = canvas.getContext('2d');
  
    const pixelBuffer = new Uint32Array(
      context.getImageData(0, 0, canvas.width, canvas.height).data.buffer
    );
  
    return !pixelBuffer.some(color => color !== 0);
  }

  public ngAfterViewInit() {
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
    canvasEl.addEventListener('focus', () => {
      console.log("forcus");
    });

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
        const prevMouseEvent = res[0];
        const currMouseEvent = res[1];

        // previous and current position with the offset
        const prevPos = prevMouseEvent.constructor.name == 'TouchEvent' ? {
          x: prevMouseEvent.changedTouches[0].clientX - rect.left,
          y: prevMouseEvent.changedTouches[0].clientY - rect.top
        } : {
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
    this.cx.clearRect(0, 0, this.myCanvas.nativeElement.width, this.myCanvas.nativeElement.height);
  }
  onFocus() {
    console.log('xxx');
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
