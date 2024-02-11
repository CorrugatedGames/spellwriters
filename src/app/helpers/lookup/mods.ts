import { type WritableSignal, signal } from '@angular/core';
import { type ContentMod, type ContentModImage } from '../../interfaces';
import { clone } from '../static/object';

export const modData: WritableSignal<Record<string, ContentMod>> = signal({});
export const assetData: WritableSignal<Record<string, Record<string, string>>> =
  signal({});

export function allMods() {
  return clone(Object.values(modData()));
}

export function getModById(id: string): ContentMod | undefined {
  const data = modData();
  const ref = data[id];

  return ref ? clone(ref) : undefined;
}

export function getModAssetInformationByName(
  modId: string,
  assetName: string,
): ContentModImage | undefined {
  const mod = getModById(modId);
  if (!mod) return undefined;

  return mod.preload.images[assetName];
}
