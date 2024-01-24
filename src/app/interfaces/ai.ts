import { PRNG } from 'seedrandom';
import { GameState, PlayableCard } from './gamestate';

export interface AIPattern {
  canMakeDecision(aistate: AIOpts): boolean;
  makeDecision(aistate: AIOpts): void;
}

export interface AIOpts {
  gamestate: GameState;
  prng: PRNG;
  playableCards: PlayableCard[];
}
