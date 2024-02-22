import { Component, inject, type OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  allElements,
  allRelics,
  allSpells,
  allStats,
  allStatusEffects,
  allTileStatuses,
  getSpellById,
} from '../../../helpers';
import { type FieldSpell } from '../../../interfaces';
import { ContentService } from '../../../services/content.service';

@Component({
  selector: 'sw-components',
  templateUrl: './components.component.html',
  styleUrl: './components.component.scss',
})
export class DebugComponentsComponent implements OnInit {
  public route = inject(ActivatedRoute);
  public contentService = inject(ContentService);

  getSpellById = getSpellById;

  public numCharacters = Array(130)
    .fill(0)
    .map((_, i) => i);
  public numSpells = Array(140)
    .fill(0)
    .map((_, i) => i);
  public numRelics = Array(10)
    .fill(0)
    .map((_, i) => i);
  public numStatusEffects = Array(32)
    .fill(0)
    .map((_, i) => i);

  public hoverCard = false;

  public spellList = allSpells();
  public elementList = allElements();
  public statList = allStats();
  public relicList = allRelics();
  public tileStatusList = allTileStatuses();
  public statusEffectList = allStatusEffects();

  public fieldSpells: FieldSpell[] = [
    {
      ...getSpellById('95ddca50-58dc-44c6-8c0c-9cc08b492920')!,
      caster: 0,
      castId: '',
      extraData: {},
    },
    {
      ...getSpellById('95ddca50-58dc-44c6-8c0c-9cc08b492920')!,
      castTime: 2,
      caster: 0,
      castId: '',
      extraData: {},
    },
    {
      ...getSpellById('95ddca50-58dc-44c6-8c0c-9cc08b492920')!,
      damage: 3,
      caster: 1,
      castId: '',
      extraData: {},
    },
    {
      ...getSpellById('95ddca50-58dc-44c6-8c0c-9cc08b492920')!,
      castTime: 7,
      caster: 1,
      castId: '',
      extraData: {},
    },
  ];

  public bannerActions = [
    {
      text: 'Action 1',
      action: () => {
        alert('clicked action 1');
      },
    },
    {
      text: 'Action 2',
      action: () => {
        alert('clicked action 2');
      },
    },
    {
      text: 'Action 3',
      action: () => {
        alert('clicked action 3');
      },
    },
  ];

  ngOnInit() {
    this.route.fragment.subscribe((fragment) => {
      setTimeout(() => {
        document.querySelector('#' + fragment)?.scrollIntoView();
      }, 0);
    });
  }
}
