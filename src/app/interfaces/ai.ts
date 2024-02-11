import { type PRNG } from 'seedrandom';
import { type GameState, type PlayableCard } from './gamestate';

export interface AIPatternImpl {
  canMakeDecision(aistate: AIOpts): boolean;
  makeDecision(aistate: AIOpts): void;
}

export interface AIPattern {
  name: string;
  id: string;
  key: string;
}

export interface AIOpts {
  gamestate: GameState;
  rng: PRNG;
  playableCards: PlayableCard[];
}
