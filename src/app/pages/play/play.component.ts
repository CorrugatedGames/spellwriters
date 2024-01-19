import { Component, effect } from '@angular/core';
import { Router } from '@angular/router';
import { createBlankGameState, drawCard, gamestate } from '../../helpers';
import { GameState, PlayableCard } from '../../interfaces';
import { ContentService } from '../../services/content.service';

@Component({
  selector: 'sw-play',
  templateUrl: './play.component.html',
  styleUrl: './play.component.scss',
})
export class PlayComponent {
  public gamestate: GameState = createBlankGameState();

  public readonly trackState = effect(() => {
    this.gamestate = gamestate();

    if (!this.gamestate.id) {
      this.router.navigate(['/']);
    }
  });

  public get player() {
    return this.gamestate.players[0];
  }

  public get playerTurn() {
    return this.gamestate.currentTurn === 0;
  }

  public get opponent() {
    return this.gamestate.players[1];
  }

  public get opponentTurn() {
    return this.gamestate.currentTurn === 1;
  }

  constructor(private router: Router, public contentService: ContentService) {}

  public drawCard() {
    drawCard(this.player);
  }

  public selectCard($event: { card: PlayableCard; i: number }) {
    console.log($event);
  }
}
