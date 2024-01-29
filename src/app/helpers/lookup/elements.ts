import { WritableSignal, signal } from '@angular/core';
import { SpellElement } from '../../interfaces';

export const elementData: WritableSignal<Record<string, SpellElement>> = signal(
  {},
);

export const elementKeyIds: WritableSignal<Record<string, string>> = signal({});

export function getElementById(id: string): SpellElement | undefined {
  const data = elementData();
  return data[id];
}

export function getElementByKey(key: string): SpellElement | undefined {
  const id = getElementIdByKey(key);
  return getElementById(id ?? '');
}

export function getElementKey(id: string): string | undefined {
  return getElementById(id)?.key;
}

export function getElementIdByKey(key: string): string | undefined {
  return elementKeyIds()[key];
}
