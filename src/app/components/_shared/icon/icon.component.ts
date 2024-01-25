import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'sw-icon',
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.scss',
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
