import { signal, type WritableSignal } from '@angular/core';
import { clone } from 'lodash';
import { type RitualImpl, type TileStatus } from '../../interfaces';

const AllTileStatuses: Record<string, RitualImpl> = {};

export const tileStatusData: WritableSignal<Record<string, TileStatus>> =
  signal({});

export function allTileStatuses() {
  return clone(Object.values(tileStatusData()));
}

export function addTileStatusImpl(key: string, tileStatus: RitualImpl) {
  AllTileStatuses[key] = tileStatus;
}

export function getTileStatusById(id: string): TileStatus | undefined {
  const data = tileStatusData();
  const ref = data[id];

  return ref ? clone(ref) : undefined;
}

export function getTileStatusByKey(key: string): TileStatus | undefined {
  const data = tileStatusData();
  const id = Object.values(data).find((tag) => tag.key === key)?.id;

  return id ? getTileStatusById(id) : undefined;
}

export function getTileStatusByName(name: string): TileStatus | undefined {
  const data = tileStatusData();
  const id = Object.values(data).find((status) => status.name === name)?.id;
  if (!id) return undefined;

  return getTileStatusById(id);
}

export function getTileStatusKey(id: string): string | undefined {
  return getTileStatusById(id)?.key;
}

export function getTileStatusImpl(id: string): RitualImpl | undefined {
  if (!id) return undefined;

  const key = getTileStatusKey(id);
  if (!key) throw new Error(`No tile status exists for ${id}`);

  return AllTileStatuses[key];
}
