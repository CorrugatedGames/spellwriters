import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[swHoverClass]',
})
export class HoverClassDirective {
  @Input() swHoverClass!: string;

  constructor(public elementRef: ElementRef) {}

  @HostListener('mouseenter') onMouseEnter() {
    this.elementRef.nativeElement.classList.add(this.swHoverClass);
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.elementRef.nativeElement.classList.remove(this.swHoverClass);
  }
}
