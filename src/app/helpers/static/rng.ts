import seedrandom, { type PRNG } from 'seedrandom';
import { gamestate } from '../gameplay/gamestate';

/**
 * Get a seeded RNG instance. Seed is based on the current gamestate.
 *
 * @category Utilities
 * @returns a PRNG instance
 */
export function seededrng(): PRNG {
  const state = gamestate();
  state.rng++;

  return seedrandom(state.id + state.rng);
}

/**
 * Choose a weighted random choice from a set of choices.
 *
 * @category Utilities
 * @param choices A mapping of choice:weight.
 * @returns {string} a chosen key from the choices.
 */
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

/**
 * Choose a random choice from a set of choices.
 *
 * @category Utilities
 * @param choices An array of choices.
 * @returns a chosen choice from the array.
 */
export function randomChoice<T>(choices: T[]): T {
  const rng = seededrng();
  return choices[Math.floor(rng() * choices.length)];
}
