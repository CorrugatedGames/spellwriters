import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'sw-icon',
  template: `
    <svg-icon
      [src]="'assets/icon/' + category + '-' + name + '.svg'"
      [svgStyle]="{
        'width.px': size,
        'height.px': size,
        fill: 'var(--' + category + '-' + name + ')'
      }"
    ></svg-icon>
  `,
  styles: `
    :host,
    svg-icon {
      display: inline-block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconComponent {
  @Input({ required: true }) category!:
    | 'icon'
    | 'element'
    | 'stat'
    | 'play'
    | 'field-effect';
  @Input({ required: true }) name!: string;
  @Input() size = 24;
}
