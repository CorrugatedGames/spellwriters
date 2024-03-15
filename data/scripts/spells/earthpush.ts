import {
  type RitualCurrentContextSpellArgs,
  type RitualImpl,
  type RitualSpellTagSpacePlacementArgs,
} from '../../../typings/interfaces';

export const earthpush: RitualImpl = {
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

      const isStationary = window.api.getSpellTagValueByKey({
        spell: tileSpell,
        tag: 'stationary',
      });
      if (!isStationary) return;

      window.api.moveSpellForwardOneStep({
        spell: tileSpell,
      });
    });
  },
};
