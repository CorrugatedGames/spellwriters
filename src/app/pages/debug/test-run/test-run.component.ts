import { Component, inject, type OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorage } from 'ngx-webstorage';
import {
  allCharacters,
  allRelics,
  clone,
  combatstateInitOptions,
  getCharacterById,
  getElementById,
  getSpellById,
  startCombat,
} from '../../../helpers';
import { getRarityById } from '../../../helpers/lookup/rarities';
import {
  type Character,
  type CombatStateInitOpts,
  type Relic,
} from '../../../interfaces';
import { CombatStateService } from '../../../services/combat-state.service';
import { ContentService } from '../../../services/content.service';

@Component({
  selector: 'sw-test-run',
  templateUrl: './test-run.component.html',
  styleUrl: './test-run.component.scss',
})
export class DebugTestRunComponent implements OnInit {
  private router = inject(Router);
  public contentService = inject(ContentService);
  public gamestateService = inject(CombatStateService);

  getCharacterById = getCharacterById;
  getSpellById = getSpellById;

  public characterList = allCharacters();
  public relicList = allRelics();

  @LocalStorage()
  public playerTestCharacterId!: string;

  @LocalStorage()
  public playerRelics!: Record<string, number>;

  @LocalStorage()
  public enemyTestCharacterId!: string;

  @LocalStorage()
  public enemyRelics!: Record<string, number>;

  ngOnInit() {
    this.playerRelics ??= {};
    this.enemyRelics ??= {};
  }

  startTestRun() {
    const player = getCharacterById(this.playerTestCharacterId);
    const enemy = getCharacterById(this.enemyTestCharacterId);

    if (!player) {
      alert('Please select a player character');
      return;
    }

    if (!enemy) {
      alert('Please select an enemy character');
      return;
    }

    const opts: CombatStateInitOpts = {
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

    combatstateInitOptions.set(opts);

    startCombat({ gamestateInitOpts: opts });

    this.router.navigate(['/play']);
  }

  elementName(elementId: string): string {
    return getElementById(elementId)?.name ?? 'unknown';
  }

  rarityName(rarityId: string): string {
    return getRarityById(rarityId)?.name ?? 'unknown';
  }

  selectPlayerCharacter(character: Character) {
    this.playerTestCharacterId = character.id;
    this.playerRelics = clone(character.relics);
  }

  selectEnemyCharacter(character: Character) {
    this.enemyTestCharacterId = character.id;
    this.enemyRelics = clone(character.relics);
  }

  selectPlayerRelic(relic: Relic, delta: 1 | -1) {
    const relicId = relic.id;
    const relics = this.playerRelics || {};
    relics[relicId] = Math.max(0, (relics[relicId] || 0) + delta);
    if (!relic.stackable) relics[relicId] = Math.min(1, relics[relicId]);
    if (relics[relicId] <= 0) delete relics[relicId];
    this.playerRelics = relics;
  }

  selectEnemyRelic(relic: Relic, delta: 1 | -1) {
    const relicId = relic.id;
    const relics = this.enemyRelics || {};
    relics[relicId] = Math.max(0, (relics[relicId] || 0) + delta);
    if (!relic.stackable) relics[relicId] = Math.min(1, relics[relicId]);
    if (relics[relicId] <= 0) delete relics[relicId];
    this.enemyRelics = relics;
  }
}
