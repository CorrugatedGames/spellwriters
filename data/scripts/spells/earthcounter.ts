import {
  type RitualCurrentContextSpellArgs,
  type RitualImpl,
  type RitualSpellCollisionSpaceArgs,
} from '../../../typings/interfaces';

export const earthcounter: RitualImpl = {
  ...window.api.defaultRitualSpell(),

  onSpellCollisionWin: (
    opts: RitualSpellCollisionSpaceArgs,
    context: RitualCurrentContextSpellArgs,
  ) => {
    if (!context) return;
    if (!window.api.isCurrentSpellContextSpell({ funcOpts: opts, context }))
      return;

    const {
      spellContext: { spell },
    } = context;

    const spellInfo = window.api.getSpellByName('Earthen Pellet');
    if (!spellInfo) return;

    const { x, y } = spell;
    const yDelta = spell.caster === 0 ? -1 : 1;
    const nextY = y + yDelta;

    const tile = window.api.getSpaceFromField({ x, y: nextY });
    if (!tile || tile.containedSpell) return;

    const fieldSpell = window.api.spellToFieldSpell({
      spell: spellInfo,
      caster: spell.caster,
      x,
      y: nextY,
    });

    window.api.addSpellAtPosition({ spell: fieldSpell, x, y: nextY });
  },
};
