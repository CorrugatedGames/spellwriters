import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorage } from 'ngx-webstorage';
import { gamestateInitOptions, startCombat } from '../../../helpers';
import { GameStateInitOpts } from '../../../interfaces';
import { ContentService } from '../../../services/content.service';
import { GameStateService } from '../../../services/game-state.service';

@Component({
  selector: 'sw-test-run',
  templateUrl: './test-run.component.html',
  styleUrl: './test-run.component.scss',
})
export class DebugTestRunComponent {
  @LocalStorage()
  public playerTestCharacterId!: string;

  @LocalStorage()
  public enemyTestCharacterId!: string;

  constructor(
    private router: Router,
    public contentService: ContentService,
    public gamestateService: GameStateService,
  ) {}

  startTestRun() {
    const player = this.contentService.getCharacter(this.playerTestCharacterId);
    const enemy = this.contentService.getCharacter(this.enemyTestCharacterId);

    if (!player) {
      alert('Please select a player character');
      return;
    }

    if (!enemy) {
      alert('Please select an enemy character');
      return;
    }

    const opts: GameStateInitOpts = {
      enemyCharacter: enemy,
      playerCharacter: player,
      fieldWidth: 5,
      fieldHeight: 5,
    };

    gamestateInitOptions.set(opts);

    startCombat(opts);

    this.router.navigate(['/play']);
  }
}
