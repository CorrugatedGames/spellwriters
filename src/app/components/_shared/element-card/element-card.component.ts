import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { getElementByKey } from '../../../helpers';
import { SpellElement } from '../../../interfaces';

@Component({
  selector: 'sw-element-card',
  templateUrl: './element-card.component.html',
  styleUrl: './element-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ElementCardComponent {
  public element = input.required<SpellElement>();

  public get formattedDescription() {
    let text = this.element().description;

    const matches = text.match(/\$[a-zA-Z]+:([a-zA-Z]+)\$/g);
    matches?.forEach((match) => {
      const [_, key] = match.split(':');
      const elementKey = key.replace('$', '');

      const elementRef = getElementByKey(elementKey);
      text = text.replace(match, elementRef?.name ?? 'UNKNOWN');
    });

    return text;
  }
}
