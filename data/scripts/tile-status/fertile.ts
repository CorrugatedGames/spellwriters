import {
  SpellStatImpl,
  type RitualCurrentContextTileArgs,
  type RitualImpl,
  type RitualPhaseChangeArgs,
  type RitualSpellTagSpaceArgs,
} from '../../../typings/interfaces';

export const fertile: RitualImpl = {
  ...window.api.defaultRitualTileStatus(),

  onCombatPhaseChange(
    opts: RitualPhaseChangeArgs,
    context: RitualCurrentContextTileArgs,
  ) {
    const { newPhase } = opts;

    const {
      tileContext: { tileStatus, x, y },
    } = context;

    if (newPhase === 'End') {
      const turnsFertile: number =
        (tileStatus.extraData['turnsFertile'] as number) ?? 3;

      if (turnsFertile > 0) {
        tileStatus.extraData['turnsFertile'] = turnsFertile - 1;
      } else {
        window.api.clearFieldStatus({
          x,
          y,
        });
      }
    }
  },

  onSpellSpaceEntered: (
    opts: RitualSpellTagSpaceArgs,
    context: RitualCurrentContextTileArgs,
  ) => {
    const { spell, x, y } = opts;

    const {
      tileContext: { x: tileX, y: tileY, key },
    } = context;

    if (!window.api.isSpellElement({ spell, element: 'fire' })) return;
    if (x !== tileX || y !== tileY) return;

    window.api.setSpellStat({
      spell,
      stat: 'damage' as SpellStatImpl,
      value: spell.damage + 1,
    });
  },
};
