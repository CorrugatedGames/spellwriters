import { signal, type WritableSignal } from '@angular/core';
import { type AIPattern, type AIPatternImpl } from '../../interfaces';

import { clone } from '../static/object';

const AllAIPatterns: Record<string, AIPatternImpl> = {};

/**
 * @internal
 */
export const aiPatternData: WritableSignal<Record<string, AIPattern>> = signal(
  {},
);

/**
 * @internal
 */
export function allAIPatterns() {
  return clone(Object.values(aiPatternData()));
}

/**
 * @internal
 */
export function addAIPatternImpl(key: string, pattern: AIPatternImpl) {
  AllAIPatterns[key] = pattern;
}

/**
 * @internal
 */
export function getAIPatternById(id: string): AIPattern | undefined {
  const data = aiPatternData();
  const ref = data[id];

  return ref ? clone(ref) : undefined;
}

/**
 * @internal
 */
export function getAIPatternByName(name: string): AIPattern | undefined {
  const data = aiPatternData();
  const id = Object.values(data).find((pattern) => pattern.name === name)?.id;
  if (!id) return undefined;

  return getAIPatternById(id);
}

/**
 * @internal
 */
export function getAIPatternKey(id: string): string | undefined {
  return getAIPatternById(id)?.key;
}

/**
 * Load an AI pattern by its id.
 *
 * @category AI
 * @param id the AI pattern id to load.
 * @returns {AIPatternImpl} the AI pattern, if found.
 */
export function getAIPatternImpl(id: string): AIPatternImpl | undefined {
  if (!id) return undefined;

  const key = getAIPatternKey(id);
  if (!key) throw new Error(`No ai pattern exists for ${id}`);

  return AllAIPatterns[key];
}
