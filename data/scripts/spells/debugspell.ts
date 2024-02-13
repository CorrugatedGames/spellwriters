import {
  type RitualCurrentContextSpellArgs,
  type RitualImpl,
  type SpellStatImpl,
  type SpellTagSpaceArgs,
} from '../../../typings/interfaces';

export const debugspell: RitualImpl = {
  ...window.api.defaultRitualSpell(),

  onSpellPlacement: (
    opts: SpellTagSpaceArgs,
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
