import { WritableSignal, signal } from '@angular/core';
import { AIPattern, AIPatternImpl } from '../../interfaces';

import * as AIPatterns from '../gameplay/ai-patterns';

const AllAIPatterns: Record<string, AIPatternImpl> = AIPatterns;

export const aiPatternData: WritableSignal<Record<string, AIPattern>> = signal(
  {},
);

export function getAIPatternById(id: string): AIPattern | undefined {
  const data = aiPatternData();
  return data[id];
}

export function getAIPatternByName(name: string): AIPattern | undefined {
  const data = aiPatternData();
  return Object.values(data).find((pattern) => pattern.name === name);
}

export function getAIPatternKey(id: string): string | undefined {
  return getAIPatternById(id)?.key;
}

export function getAIPatternImpl(id: string): AIPatternImpl | undefined {
  const key = getAIPatternKey(id);
  if (!key) throw new Error(`No ai pattern exists for ${id}`);

  return AllAIPatterns[key];
}
