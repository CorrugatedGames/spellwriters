import seedrandom, { PRNG } from 'seedrandom';
import { gamestate } from '../gameplay/signal';

export function rng(seed: string): PRNG {
  return seedrandom(seed);
}

export function seededrng(): PRNG {
  const state = gamestate();
  state.rng++;

  return seedrandom(state.id + state.rng);
}

export function weighted(choices: Record<string, number>): string {
  const rng = seededrng();

  const total = Object.values(choices).reduce((acc, cur) => acc + cur, 0);
  let choice = rng() * total;

  for (const [key, weight] of Object.entries(choices)) {
    choice -= weight;
    if (choice <= 0) return key;
  }

  return Object.keys(choices)[0];
}

export function randomChoice<T>(choices: T[]): T {
  const rng = seededrng();
  return choices[Math.floor(rng() * choices.length)];
}
