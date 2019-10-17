import { Directive, ElementRef, HostListener, Input, OnInit, AfterViewInit, OnDestroy, NgZone } from '@angular/core';


@Directive({
  selector: '[appMyDraggable]'
})
export class MyDraggableDirective implements OnInit, AfterViewInit, OnDestroy {
  private dragging: boolean;
  private lastPageX = 0;
  private lastPageY = 0;
  private domWidth = 0;
  private domHeight = 0;
  private domElement: any;
  private innerWidth = window.innerWidth;
  private innerHeight = window.innerHeight;
  private documentDragListener: any;
  private documentDragEndListener: any;
  @Input() draggable: boolean;
  @Input() isCloseIcon: boolean;
  constructor(
    private el: ElementRef,
    private _ngZone: NgZone,
  ) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    if (this.draggable) {
      this.bindGlobalListeners();
    }
  }

  ngOnDestroy() {
    if (this.el) {
      this.dragging = false;
      this.unbindGlobalListeners();
    }
  }


  @HostListener('mousedown', ['$event']) initDrag(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    this._ngZone.runOutsideAngular(() => {
      // only bind once
      if (!this.domElement) {
        this.domElement = this.el.nativeElement.parentNode.parentNode.parentNode.parentNode;
        this.domWidth = this.domElement.offsetWidth;
        this.domHeight = this.domElement.offsetHeight;
      }
      if (this.draggable) {
        this.dragging = true;
        this.lastPageX = event.clientX;
        this.lastPageY = event.clientY;
        const curPos = this.el.nativeElement.getBoundingClientRect();
        const leftPos = curPos.left;
        const topPos = curPos.top;
        this.domElement.style.position = 'absolute';
        this.domElement.style.left = leftPos + 'px';
        this.domElement.style.top = topPos + 'px';
      }
    });
  }


  onDrag(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (this.dragging) {
      const deltaX = event.clientX - this.lastPageX;
      const deltaY = event.clientY - this.lastPageY;
      let leftPos = parseInt(this.domElement.style.left, 10) + deltaX;
      let topPos = parseInt(this.domElement.style.top, 10) + deltaY;
      leftPos = Math.max(0, Math.min(leftPos, this.innerWidth - this.domWidth));
      topPos = Math.max(0, Math.min(topPos, this.innerHeight - this.domHeight));
      this.domElement.style.left = leftPos + 'px';
      this.domElement.style.top = topPos + 'px';
      this.lastPageX = event.clientX;
      this.lastPageY = event.clientY;
    }
  }

  endDrag(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (this.draggable) {
      this.dragging = false;
    }
  }

  bindGlobalListeners() {
    if (this.draggable) {
      this.bindDocumentDragListener();
      this.bindDocumentDragEndListener();
    }
  }
  unbindGlobalListeners() {
    this.unbindDocumentDragListener();
    this.unbindDocumentDragEndListener();
  }
  bindDocumentDragListener() {
    this._ngZone.runOutsideAngular(() => {
      this.documentDragListener = this.onDrag.bind(this);
      window.document.addEventListener('mousemove', this.documentDragListener);
    });
  }
  unbindDocumentDragListener() {
    if (this.documentDragListener) {
      window.document.removeEventListener('mousemove', this.documentDragListener);
      this.documentDragListener = null;
    }
  }
  bindDocumentDragEndListener() {
    this._ngZone.runOutsideAngular(() => {
      this.documentDragEndListener = this.endDrag.bind(this);
      window.document.addEventListener('mouseup', this.documentDragEndListener);
    });
  }

  unbindDocumentDragEndListener() {
    if (this.documentDragEndListener) {
      window.document.removeEventListener('mouseup', this.documentDragEndListener);
      this.documentDragEndListener = null;
    }
  }

}
