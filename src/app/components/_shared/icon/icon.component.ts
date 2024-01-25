import { ChangeDetectionStrategy, Component, input } from '@angular/core';

type IconType = 'icon' | 'element' | 'stat' | 'play' | 'field-effect';

@Component({
  selector: 'sw-icon',
  template: `
    <svg-icon
      [src]="'assets/icon/' + category() + '-' + name() + '.svg'"
      [svgStyle]="{
        'width.px': size(),
        'height.px': size(),
        fill: 'var(--' + category() + '-' + name() + ')'
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
  public category = input.required<IconType>();
  public name = input.required<string>();
  public size = input<number>(24);
}
