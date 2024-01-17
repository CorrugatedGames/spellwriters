import { Component, effect } from '@angular/core';
import { Router } from '@angular/router';
import { createBlankGameState, gamestate } from '../../helpers';
import { GameState } from '../../interfaces';

@Component({
  selector: 'sw-play',
  templateUrl: './play.component.html',
  styleUrl: './play.component.scss',
})
export class PlayComponent {
  public gamestate: GameState = createBlankGameState();

  constructor(private router: Router) {}

  public readonly trackState = effect(() => {
    this.gamestate = gamestate();

    if (!this.gamestate.id) {
      this.router.navigate(['/']);
    }
  });
}
