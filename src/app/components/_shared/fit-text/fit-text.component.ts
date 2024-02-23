import {
  Component,
  ElementRef,
  Renderer2,
  ViewChild,
  inject,
  input,
  type AfterViewInit,
} from '@angular/core';
import { delay } from '../../../helpers';

// shoutout to https://github.com/pikselinweb/ngx-fittext for rough implementation
// it had bugs :(

@Component({
  selector: 'sw-fit-text',
  template: `
    <div #controllerDiv>
      <ng-content></ng-content>
    </div>
  `,
  styles: `
    :host {
      display: flex;
      position: relative;
      margin: 0;
      padding: 0;

      align-items: center;
    }
  `,
})
export class FitTextComponent implements AfterViewInit {
  private renderer = inject(Renderer2);
  private el = inject(ElementRef);

  @ViewChild('controllerDiv') controllerDiv!: ElementRef;

  public width = input<string>();
  public height = input.required<string>();

  private minFontSize = 12;
  private stepSize = 2;

  ngAfterViewInit() {
    this.fitTextToBox();
  }

  async fitTextToBox() {
    this.renderer.setStyle(this.controllerDiv.nativeElement, 'opacity', 0);

    await delay(20);

    this.renderer.setStyle(
      this.el.nativeElement,
      'width',
      this.width() || '100%',
    );

    this.renderer.setStyle(this.el.nativeElement, 'height', this.height());

    if (this.isTextTooBigForContainer()) {
      this.resizeTextDownward();
    }

    this.renderer.setStyle(this.controllerDiv.nativeElement, 'opacity', 1);
  }

  private isTextTooBigForContainer() {
    const wrapperWidth = this.el.nativeElement.offsetWidth;
    const wrapperHeight = this.el.nativeElement.offsetHeight;
    const controllerWidth = this.controllerDiv.nativeElement.offsetWidth;
    const controllerHeight = this.controllerDiv.nativeElement.offsetHeight;
    const scrollWidth = this.controllerDiv.nativeElement.scrollWidth;
    const scrollHeight = this.controllerDiv.nativeElement.scrollHeight;

    return (
      wrapperWidth < controllerWidth ||
      wrapperHeight < controllerHeight ||
      wrapperWidth < scrollWidth ||
      wrapperHeight < scrollHeight
    );
  }

  private resizeTextDownward() {
    while (this.isTextTooBigForContainer()) {
      const fs = getComputedStyle(
        this.controllerDiv.nativeElement,
      ).getPropertyValue('font-size');

      const { size, unit } = this.splitFontSize(fs);

      let fontSize = size;
      if (fontSize <= this.minFontSize) {
        break;
      }

      fontSize -= this.stepSize;

      this.renderer.setStyle(
        this.controllerDiv.nativeElement,
        'font-size',
        `${fontSize}${unit}`,
      );
    }
  }

  private splitFontSize(fs: string) {
    const size = fs.match(/\d+/g);
    const unit = fs.match(/[a-zA-Z]+/g);
    return {
      size: size ? Number(size[0]) : 2,
      unit: unit ? unit[0] : 'px',
    };
  }
}
