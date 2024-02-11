import { Component, input } from '@angular/core';
import { type FieldElement, type FieldSpell } from '../../../interfaces';

@Component({
  selector: 'sw-field-spell',
  templateUrl: './field-spell.component.html',
  styleUrls: ['./field-spell.component.scss'],
})
export class FieldSpellComponent {
  public spell = input.required<FieldSpell>();
  public element = input<FieldElement>();

  public get isCasting() {
    return this.spell().castTime > 0;
  }
}
