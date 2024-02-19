import {
  type RitualCurrentContextTileArgs,
  type RitualImpl,
  type RitualPhaseChangeArgs,
  type RitualSpellPlaceCheckArgs,
  type RitualSpellTagSpaceArgs,
} from '../../../typings/interfaces';

export const devastated: RitualImpl = {
  ...window.api.defaultRitualTileStatus(),

  onSpellPlace(
    opts: RitualSpellPlaceCheckArgs,
    context: RitualCurrentContextTileArgs,
  ) {
    const { x, y } = opts;
    const {
      tileContext: { x: tileX, y: tileY, key },
    } = context;

    if (x === tileX && y === tileY && key === 'devastated') return false;
    return true;
  },

  onSpellSpaceEnter(
    opts: RitualSpellTagSpaceArgs,
    context: RitualCurrentContextTileArgs,
  ) {
    const { x, y } = opts;
    const {
      tileContext: { x: tileX, y: tileY, key },
    } = context;

    if (x === tileX && y === tileY && key === 'devastated') return false;
    return true;
  },

  onCombatPhaseChange(
    opts: RitualPhaseChangeArgs,
    context: RitualCurrentContextTileArgs,
  ) {
    const { newPhase } = opts;

    const {
      tileContext: { tileStatus, x, y },
    } = context;

    if (newPhase === 'End') {
      const turnsDevastated: number =
        (tileStatus.extraData['turnsDevastated'] as number) ?? 3;

      if (turnsDevastated > 0) {
        tileStatus.extraData['turnsDevastated'] = turnsDevastated - 1;
      } else {
        window.api.clearFieldStatus({
          x,
          y,
        });
      }
    }
  },
};
