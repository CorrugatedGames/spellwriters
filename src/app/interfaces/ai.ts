import { type PRNG } from 'seedrandom';
import { type GameState, type PlayableCard } from './gamestate';

/**
 * @category Modding
 * @category AI
 */
export interface AIPatternImpl {
  canMakeDecision(aistate: AIOpts): boolean;
  makeDecision(aistate: AIOpts): void;
}

/**
 * @category Modding
 * @category AI
 * @category Mod Data
 */
export interface AIPattern {
  name: string;
  id: string;
  key: string;
}

/**
 * @internal
 */
export interface AIOpts {
  gamestate: GameState;
  rng: PRNG;
  playableCards: PlayableCard[];
}
