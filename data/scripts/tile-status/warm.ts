import {
  type RitualCurrentContextTileArgs,
  type RitualImpl,
  type RitualPhaseChangeArgs,
} from '../../../typings/interfaces';

export const warm: RitualImpl = {
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
      const turnsWarm: number =
        (tileStatus.extraData['turnsWarm'] as number) ?? 3;

      if (turnsWarm > 0) {
        tileStatus.extraData['turnsWarm'] = turnsWarm - 1;
      } else {
        window.api.setFieldStatus({
          x,
          y,

          status: window.api.tileStatusKeyToTileStatus({
            tileStatusKey: 'devastated',
            caster: tileStatus.caster,
            extraData: { turnsDevastated: 2 },
          }),
        });

        window.api.clearFieldSpell({
          x,
          y,
        });
      }
    }
  },
};
