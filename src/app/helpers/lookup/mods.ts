import { signal, type WritableSignal } from '@angular/core';
import { type ContentMod, type ContentModImage } from '../../interfaces';
import { clone } from '../static/object';

/**
 * @internal
 */
export const modData: WritableSignal<Record<string, ContentMod>> = signal({});

/**
 * @internal
 */
export const assetData: WritableSignal<Record<string, Record<string, string>>> =
  signal({});

/**
 * @internal
 */
export function allMods() {
  return clone(Object.values(modData()));
}

/**
 * @internal
 */
export function getModById(id: string): ContentMod | undefined {
  const data = modData();
  const ref = data[id];

  return ref ? clone(ref) : undefined;
}

/**
 * @internal
 */
export function getModAssetInformationByName(
  modId: string,
  assetName: string,
): ContentModImage | undefined {
  const mod = getModById(modId);
  if (!mod) return undefined;

  return mod.preload.images[assetName];
}
