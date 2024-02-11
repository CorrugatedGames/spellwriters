import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { getElementById, getElementByKey } from '../../../helpers';
import { type SpellElement } from '../../../interfaces';

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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [_, key] = match.split(':');
      const elementKey = key.replace('$', '');

      const elementRef = getElementByKey(elementKey);
      text = text.replace(match, elementRef?.name ?? 'UNKNOWN');
    });

    return text;
  }

  public allInteractions = computed(
    () =>
      this.element()
        .interactions.map((interaction) => getElementById(interaction.element))
        .filter(Boolean) as SpellElement[],
  );
}
