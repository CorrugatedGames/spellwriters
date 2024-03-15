import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import {
  getElementById,
  getElementKey,
  getSpellPatternById,
  getSpellTagById,
} from '../../../helpers';
import { getRarityKey } from '../../../helpers/lookup/rarities';
import { SpellStat, type Spell } from '../../../interfaces';

@Component({
  selector: 'sw-spell-card',
  templateUrl: './spell-card.component.html',
  styleUrl: './spell-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpellCardComponent {
  public spell = input.required<Spell>();
  public isUpsideDown = input<boolean>(false);
  public isSmall = input<boolean>(false);
  public isGlowing = input<boolean>(false);
  public extraCost = input<number>(0);

  public get spellElementData() {
    return getElementById(this.spell().element);
  }

  public get spellElement() {
    return this.isUpsideDown() ? '' : getElementKey(this.spell()?.element);
  }

  public get spellRarity() {
    return this.isUpsideDown() ? '' : getRarityKey(this.spell()?.rarity);
  }

  public get isInstant() {
    return this.spell().instant;
  }

  public get spellStatsAndValues(): {
    stat: SpellStat;
    value: string | number;
    visible: boolean;
  }[] {
    return [
      {
        stat: SpellStat.Cost,
        value: this.spell().cost + this.extraCost(),
        visible: true,
      },
      {
        stat: SpellStat.Damage,
        value: this.spell().damage,
        visible: !this.isInstant,
      },
      {
        stat: SpellStat.CastTime,
        value: this.spell().castTime,
        visible: !this.isInstant,
      },
      {
        stat: SpellStat.Speed,
        value: this.spell().speed,
        visible: !this.isInstant,
      },
      {
        stat: SpellStat.Depth,
        value: `${this.spell().depthMin}-${this.spell().depthMax}`,
        visible: true,
      },
      {
        stat: SpellStat.Pattern,
        value: getSpellPatternById(this.spell().pattern)?.name ?? 'Unknown',
        visible: true,
      },
    ];
  }

  public get spellTags(): { name: string; value: number }[] {
    return Object.keys(this.spell().tags).map((name) => ({
      name: getSpellTagById(name)?.name ?? '(unknown)',
      value: this.spell().tags[name] ?? 0,
    }));
  }
}
