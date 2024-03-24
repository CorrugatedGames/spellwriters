import type {
  CombatTurnOrder,
  FieldStatus,
  TileStatus,
} from '../../interfaces';
import { getTileStatusByKey } from '../lookup/tile-status';
import { getId } from '../static/uuid';
import { combatState } from './combatstate';

/**
 * Get the extra data for a field status.
 *
 * @category Field Status
 * @param opts.status the field status to get the extra data for
 * @param opts.key the key to get from the extra data
 * @returns {unknown}
 */
export function getExtraDataForFieldStatus<T>(opts: {
  status: FieldStatus;
  key: string;
}): T {
  const { status, key } = opts;

  return status.extraData[key] as T;
}

/**
 * Set the extra data for a field status.
 *
 * @category Field Status
 * @param opts.status the field status to set the extra data for
 * @param opts.key the key to set in the extra data
 * @param opts.value the value to set in the extra data
 */
export function setExtraDataForFieldStatus(opts: {
  status: FieldStatus;
  key: string;
  value: unknown;
}): void {
  const { status, key, value } = opts;

  status.extraData[key] = value;
}

/**
 * Clear the status of a field.
 *
 * @category Field Status
 * @param opts.x the x coordinate of the field
 * @param opts.y the y coordinate of the field
 */
export function clearFieldStatus(opts: { x: number; y: number }): void {
  setFieldStatus({ x: opts.x, y: opts.y, status: undefined });
}

/**
 * Set a field status onto the field.
 *
 * @category Field Status
 * @param opts.x the x coordinate of the field
 * @param opts.y the y coordinate of the field
 * @param opts.status The field status to set. Can be undefined, which will clear the field status.
 */
export function setFieldStatus(opts: {
  x: number;
  y: number;
  status: FieldStatus | undefined;
}): void {
  const { x, y, status } = opts;
  const { field } = combatState();

  if (!status) {
    field[y][x].containedStatus = undefined;
    return;
  }

  field[y][x].containedStatus = status;
}

/**
 * Convert a tile status to a field status.
 *
 * @category Field Status
 * @param opts.tileStatus - The tile status to convert
 * @param opts.caster - The caster of the tile status
 * @param opts.extraData - Extra data to add to the field status
 * @returns {FieldStatus} the new field status
 */
export function tileStatusToFieldStatus(opts: {
  tileStatus: TileStatus;
  caster: CombatTurnOrder;
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

/**
 * Convert a tile status key to a tile status. Shorthand to make a field status without needing the content id.
 *
 * @category Field Status
 * @param opts.tileStatusKey - The tile status key to convert
 * @param opts.caster - The caster of the tile status
 * @param opts.extraData - Extra data to add to the field status
 */
export function tileStatusKeyToTileStatus(opts: {
  tileStatusKey: string;
  caster: CombatTurnOrder;
  extraData?: Record<string, unknown>;
}): FieldStatus {
  const { tileStatusKey, caster, extraData } = opts;

  const tileStatus = getTileStatusByKey(tileStatusKey);
  if (!tileStatus) throw new Error(`No tile status for ${tileStatusKey}`);

  return tileStatusToFieldStatus({ tileStatus, caster, extraData });
}
