import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import {
  getElementById,
  getElementKey,
  getSpellPatternById,
  getSpellTagById,
} from '../../../helpers';
import { getRarityKey } from '../../../helpers/lookup/rarities';
import { type Spell, SpellStat } from '../../../interfaces';
import { type ContentService } from '../../../services/content.service';

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

  public get spellStatsAndValues(): {
    stat: SpellStat;
    value: string | number;
  }[] {
    return [
      {
        stat: SpellStat.Damage,
        value: this.spell().damage,
      },
      {
        stat: SpellStat.Cost,
        value: this.spell().cost + this.extraCost(),
      },
      {
        stat: SpellStat.CastTime,
        value: this.spell().castTime,
      },
      {
        stat: SpellStat.Speed,
        value: this.spell().speed,
      },
      {
        stat: SpellStat.Depth,
        value: `${this.spell().depthMin}-${this.spell().depthMax}`,
      },
      {
        stat: SpellStat.Pattern,
        value: getSpellPatternById(this.spell().pattern)?.name ?? 'Unknown',
      },
    ];
  }

  public get spellTags(): { name: string; value: number }[] {
    return Object.keys(this.spell().tags).map((name) => ({
      name: getSpellTagById(name)?.name ?? '(unknown)',
      value: this.spell().tags[name] ?? 0,
    }));
  }

  constructor(public contentService: ContentService) {}
}
