import {
  Directive,
  ElementRef,
  HostListener,
  inject,
  input,
} from '@angular/core';

@Directive({
  selector: '[swHoverClass]',
})
export class HoverClassDirective {
  private elementRef = inject(ElementRef);

  public swHoverClass = input<string>('');

  @HostListener('mouseenter') onMouseEnter() {
    this.elementRef.nativeElement.classList.add(this.swHoverClass());
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.elementRef.nativeElement.classList.remove(this.swHoverClass());
  }
}
