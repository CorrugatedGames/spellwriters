import {
  type RitualCurrentContextSpellArgs,
  type RitualImpl,
  type RitualSpellTagSpacePlacementArgs,
} from '../../../typings/interfaces';

export const watertides: RitualImpl = {
  ...window.api.defaultRitualSpell(),

  onSpellPlaced: (
    opts: RitualSpellTagSpacePlacementArgs,
    context: RitualCurrentContextSpellArgs,
  ) => {
    if (!context) return;
    if (!window.api.isCurrentSpellContextSpell({ funcOpts: opts, context }))
      return;
    if (!window.api.isFirstInvocationOfPlacedSpell({ funcOpts: opts })) return;

    const spaces = window.api.getFieldSpaces();
    spaces.forEach((space) => {
      const fieldSpace = window.api.getSpaceFromField(space);
      const tileSpell = fieldSpace?.containedSpell;
      if (!tileSpell || tileSpell.caster !== context.spellContext.spell.caster)
        return;

      if (!window.api.isSpellElement({ spell: tileSpell, element: 'water' }))
        return;

      window.api.moveSpellForwardOneStep({
        spell: tileSpell,
      });
    });
  },
};
