import { type WritableSignal, signal } from '@angular/core';
import { type Character } from '../../interfaces';
import { clone } from '../static/object';

export const characterData: WritableSignal<Record<string, Character>> = signal(
  {},
);

export function allCharacters() {
  return clone(Object.values(characterData()));
}

export function getCharacterById(id: string): Character | undefined {
  const data = characterData();
  const ref = data[id];

  return ref ? clone(ref) : undefined;
}

export function getCharacterByName(name: string): Character | undefined {
  const data = characterData();
  const id = Object.values(data).find(
    (character) => character.name === name,
  )?.id;
  if (!id) return undefined;

  return getCharacterById(id);
}
