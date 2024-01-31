import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { getElementKey, getSpellPatternById } from '../../../helpers';
import { Spell, SpellStat, SpellTag } from '../../../interfaces';
import { ContentService } from '../../../services/content.service';

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

  public get spellElement() {
    return this.isUpsideDown() ? '' : getElementKey(this.spell()?.element);
  }

  public get spellRarity() {
    return this.isUpsideDown() ? '' : this.spell()?.rarity.toLowerCase();
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

  public get spellTags(): { name: SpellTag; value: number }[] {
    return (Object.keys(this.spell().tags) as SpellTag[]).map((name) => ({
      name,
      value: this.spell().tags[name] ?? 0,
    }));
  }

  constructor(public contentService: ContentService) {}
}
