import { WritableSignal, signal } from '@angular/core';
import { Character } from '../../interfaces';

export const characterData: WritableSignal<Record<string, Character>> = signal(
  {},
);

export function getCharacterById(id: string): Character | undefined {
  const data = characterData();
  return data[id];
}
