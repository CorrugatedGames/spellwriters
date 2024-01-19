import seedrandom, { PRNG } from 'seedrandom';
import { gamestate } from './signal';

export function rng(seed: string): PRNG {
  return seedrandom(seed);
}

export function seededrng(): PRNG {
  const state = gamestate();
  return seedrandom(state.id);
}
