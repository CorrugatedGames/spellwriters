import { v4 as uuid } from 'uuid';

/**
 * Get a unique id. Not seeded, and will always be a random uuid (v4).
 *
 * @category Utilities
 * @returns {string} - The unique id
 */
export function getId(): string {
  return uuid();
}
