import seedrandom, { PRNG } from 'seedrandom';

export function rng(seed: string): PRNG {
  return seedrandom(seed);
}
