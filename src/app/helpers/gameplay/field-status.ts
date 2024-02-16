import type { FieldStatus, TileStatus, TurnOrder } from '../../interfaces';
import { getTileStatusByKey } from '../lookup/tile-status';
import { getId } from '../static/uuid';
import { gamestate } from './signal';

export function getExtraDataForFieldStatus(opts: {
  status: FieldStatus;
  key: string;
}): unknown {
  const { status, key } = opts;

  return status.extraData[key];
}

export function setExtraDataForFieldStatus(opts: {
  status: FieldStatus;
  key: string;
  value: unknown;
}): void {
  const { status, key, value } = opts;

  status.extraData[key] = value;
}

export function clearFieldStatus(opts: { x: number; y: number }): void {
  setFieldStatus({ x: opts.x, y: opts.y, status: undefined });
}

export function setFieldStatus(opts: {
  x: number;
  y: number;
  status: FieldStatus | undefined;
}): void {
  const { x, y, status } = opts;
  const { field } = gamestate();

  if (!status) {
    field[y][x].containedStatus = undefined;
    return;
  }

  field[y][x].containedStatus = status;
}

export function tileStatusToFieldStatus(opts: {
  tileStatus: TileStatus;
  caster: TurnOrder;
  extraData?: Record<string, unknown>;
}): FieldStatus {
  const { tileStatus, caster, extraData } = opts;

  return {
    ...tileStatus,
    castId: getId(),
    caster,
    extraData: extraData ?? {},
  };
}

export function tileStatusKeyToTileStatus(opts: {
  tileStatusKey: string;
  caster: TurnOrder;
  extraData?: Record<string, unknown>;
}): FieldStatus {
  const { tileStatusKey, caster, extraData } = opts;

  const tileStatus = getTileStatusByKey(tileStatusKey);
  if (!tileStatus) throw new Error(`No tile status for ${tileStatusKey}`);

  return tileStatusToFieldStatus({ tileStatus, caster, extraData });
}
