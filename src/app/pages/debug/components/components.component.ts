import { Component } from '@angular/core';
import { FieldSpell } from '../../../interfaces';
import { ContentService } from '../../../services/content.service';

@Component({
  selector: 'sw-components',
  templateUrl: './components.component.html',
  styleUrl: './components.component.scss',
})
export class DebugComponentsComponent {
  public numSpells = Array(261)
    .fill(0)
    .map((_, i) => i);
  public numCharacters = Array(130)
    .fill(0)
    .map((_, i) => i);

  public hoverCard = false;

  public fieldSpells: FieldSpell[] = [
    {
      ...this.contentService.getSpell('95ddca50-58dc-44c6-8c0c-9cc08b492920')!,
      caster: 0,
      castId: '',
    },
    {
      ...this.contentService.getSpell('95ddca50-58dc-44c6-8c0c-9cc08b492920')!,
      castTime: 2,
      caster: 0,
      castId: '',
    },
    {
      ...this.contentService.getSpell('95ddca50-58dc-44c6-8c0c-9cc08b492920')!,
      damage: 3,
      caster: 1,
      castId: '',
    },
    {
      ...this.contentService.getSpell('95ddca50-58dc-44c6-8c0c-9cc08b492920')!,
      castTime: 7,
      caster: 1,
      castId: '',
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

  constructor(public contentService: ContentService) {}
}
