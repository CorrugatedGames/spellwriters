import {
  type RitualCurrentContextSpellArgs,
  type RitualImpl,
  type RitualSpellDestroyedArgs,
} from '../../../typings/interfaces';

export const earthcrumble: RitualImpl = {
  ...window.api.defaultRitualSpell(),

  onSpellDestroyed: (
    opts: RitualSpellDestroyedArgs,
    context: RitualCurrentContextSpellArgs,
  ) => {
    if (!context) return;
    if (!window.api.isCurrentSpellContextSpell({ funcOpts: opts, context }))
      return;

    const {
      spellContext: { spell },
    } = context;

    const spellInfo = window.api.getSpellByName('Ruined Wall');

    if (!spellInfo) return;

    const { x, y } = spell;
    const tile = window.api.getSpaceFromField({ x, y });
    if (!tile || tile.containedSpell) return;

    const fieldSpell = window.api.spellToFieldSpell({
      spell: spellInfo,
      caster: spell.caster,
      x,
      y,
    });

    window.api.addSpellAtPosition({ spell: fieldSpell, x, y });
  },
};
