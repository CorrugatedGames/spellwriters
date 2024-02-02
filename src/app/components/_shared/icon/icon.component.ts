import { ChangeDetectionStrategy, Component, input } from '@angular/core';

type IconType = 'core' | 'external' | 'element' | 'stat' | 'play';

@Component({
  selector: 'sw-icon',
  template: `
    <svg-icon
      [name]="path"
      [svgStyle]="{
        'width.px': size(),
        'height.px': size(),
        fill: color() ? color() : 'var(--' + category() + '-' + name() + ')'
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
  public color = input<string>();
  public size = input<number>(24);

  public get path(): string {
    return `${this.category()}-${this.name()}`;
  }
}
