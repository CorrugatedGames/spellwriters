import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorage } from 'ngx-webstorage';
import {
  allCharacters,
  getCharacterById,
  getRelicById,
  getSpellById,
} from '../../helpers';
import type { Character } from '../../interfaces';

@Component({
  selector: 'sw-new-run',
  templateUrl: './new-run.component.html',
  styleUrl: './new-run.component.scss',
})
export class NewRunComponent {
  private router = inject(Router);

  getCharacterById = getCharacterById;
  getRelicById = getRelicById;
  getSpellById = getSpellById;

  @LocalStorage()
  public playerCharacterId!: string;

  public characterList = allCharacters().filter((c) => c.pickable);

  public get character() {
    return getCharacterById(this.playerCharacterId);
  }

  public get relics() {
    if (!this.character) return [];

    return Object.keys(this.character.relics).map((id) => getRelicById(id));
  }

  selectPlayerCharacter(character: Character) {
    this.playerCharacterId = character.id;
  }

  startRealRun() {
    const player = getCharacterById(this.playerCharacterId);

    if (!player) {
      return;
    }

    // TODO: send to starspace first

    /*
    const opts: GameStateInitOpts = {
      enemyCharacter: {
        ...enemy,
        relics: this.enemyRelics,
      },
      playerCharacter: {
        ...player,
        relics: this.playerRelics,
      },
      fieldWidth: 5,
      fieldHeight: 5,
    };

    gamestateInitOptions.set(opts);

    startCombat({ gamestateInitOpts: opts });

    this.router.navigate(['/play']);
    */
  }
}
