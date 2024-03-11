import type {
  RitualCurrentContextSpellArgs,
  RitualImpl,
  RitualSpellStatChangeArgs,
} from '../../../typings/interfaces';

export const stationary: RitualImpl = {
  ...window.api.defaultRitualSpellTag(),

  onSpellStatChange(
    opts: RitualSpellStatChangeArgs,
    context: RitualCurrentContextSpellArgs,
  ) {
    if (!context) return;
    if (!window.api.isCurrentSpellContextSpell({ funcOpts: opts, context }))
      return;

    // infinite loop protection
    const { stat, newValue, oldValue } = opts;
    if (stat !== 'speed' || newValue === oldValue || newValue === 0) return;

    const {
      spellContext: { spell },
    } = context;

    window.api.setSpellStat({
      spell,
      stat: 'speed',
      value: 0,
    });
  },
};
