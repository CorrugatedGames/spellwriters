import { PRNG } from 'seedrandom';
import { GameState, PlayableCard } from './gamestate';

export interface AIPatternImpl {
  canMakeDecision(aistate: AIOpts): boolean;
  makeDecision(aistate: AIOpts): void;
}

export interface AIOpts {
  gamestate: GameState;
  rng: PRNG;
  playableCards: PlayableCard[];
}
