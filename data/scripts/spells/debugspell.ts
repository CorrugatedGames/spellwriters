import {
  type RitualCurrentContextSpellArgs,
  type RitualImpl,
  type RitualSpellSpaceArgs,
  type SpellStatImpl,
} from '../../../typings/interfaces';

export const debugspell: RitualImpl = {
  ...window.api.defaultRitualSpell(),

  onSpellPlaced: (
    opts: RitualSpellSpaceArgs,
    context: RitualCurrentContextSpellArgs,
  ) => {
    if (!context) return;
    if (!window.api.isCurrentSpellContextSpell({ funcOpts: opts, context }))
      return;

    const {
      spellContext: { spell },
    } = context;

    window.api.setSpellStat({
      spell,
      stat: 'damage' as SpellStatImpl,
      value: spell.damage + 3,
    });
  },
};
