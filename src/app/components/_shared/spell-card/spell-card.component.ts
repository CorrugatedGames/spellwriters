import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Spell, SpellStat, SpellTag } from '../../../interfaces';
import { ContentService } from '../../../services/content.service';

@Component({
  selector: 'sw-spell-card',
  templateUrl: './spell-card.component.html',
  styleUrl: './spell-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpellCardComponent {
  @Input({ required: true }) public spell!: Spell;

  public get spellStatsAndValues(): {
    stat: SpellStat;
    value: string | number;
  }[] {
    return [
      {
        stat: SpellStat.Damage,
        value: this.spell.damage,
      },
      {
        stat: SpellStat.Cost,
        value: this.spell.cost,
      },
      {
        stat: SpellStat.CastTime,
        value: this.spell.castTime,
      },
      {
        stat: SpellStat.Speed,
        value: this.spell.speed,
      },
      {
        stat: SpellStat.Depth,
        value: `${this.spell.depthMin}-${this.spell.depthMax}`,
      },
      {
        stat: SpellStat.Pattern,
        value: this.spell.pattern,
      },
    ];
  }

  public get spellTags(): { name: SpellTag; value: number }[] {
    return (Object.keys(this.spell.tags) as SpellTag[]).map((name) => ({
      name,
      value: this.spell.tags[name] ?? 0,
    }));
  }

  constructor(public contentService: ContentService) {}
}
