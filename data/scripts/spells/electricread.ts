import {
  type RitualCurrentContextSpellArgs,
  type RitualImpl,
  type RitualSpellTagSpacePlacementArgs,
} from '../../../typings/interfaces';

export const electricread: RitualImpl = {
  ...window.api.defaultRitualSpell(),

  onSpellPlaced: (
    opts: RitualSpellTagSpacePlacementArgs,
    context: RitualCurrentContextSpellArgs,
  ) => {
    if (!context) return;
    if (!window.api.isCurrentSpellContextSpell({ funcOpts: opts, context }))
      return;
    if (!window.api.isFirstInvocationOfPlacedSpell({ funcOpts: opts })) return;

    const {
      spellContext: { spell },
    } = context;

    const allFieldSpellsCount = window.api
      .findSpellsOnField()
      .filter((node) => !node.spell.instant).length;

    window.api.addStatusEffectToPlayer({
      player: window.api.getActivePlayerByTurnOrder({
        turnOrder: spell.caster,
      }),
      statusEffectKey: 'overcharge',
      value: allFieldSpellsCount,
    });
  },
};