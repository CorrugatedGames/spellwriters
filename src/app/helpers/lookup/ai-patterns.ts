import { WritableSignal, signal } from '@angular/core';
import { AIPattern, AIPatternImpl } from '../../interfaces';

import * as AIPatterns from '../gameplay/ai-patterns';
import { clone } from '../static/object';

const AllAIPatterns: Record<string, AIPatternImpl> = AIPatterns;

export const aiPatternData: WritableSignal<Record<string, AIPattern>> = signal(
  {},
);

export function allAIPatterns() {
  return clone(Object.values(aiPatternData()));
}

export function getAIPatternById(id: string): AIPattern | undefined {
  const data = aiPatternData();
  const ref = data[id];

  return ref ? clone(ref) : undefined;
}

export function getAIPatternByName(name: string): AIPattern | undefined {
  const data = aiPatternData();
  const id = Object.values(data).find((pattern) => pattern.name === name)?.id;
  if (!id) return undefined;

  return getAIPatternById(id);
}

export function getAIPatternKey(id: string): string | undefined {
  return getAIPatternById(id)?.key;
}

export function getAIPatternImpl(id: string): AIPatternImpl | undefined {
  if (!id) return undefined;

  const key = getAIPatternKey(id);
  if (!key) throw new Error(`No ai pattern exists for ${id}`);

  return AllAIPatterns[key];
}
