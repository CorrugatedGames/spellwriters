import {
  SpellStatImpl,
  type RitualCurrentContextSpellArgs,
  type RitualImpl,
  type RitualSpellTagSpacePlacementArgs,
} from '../../../typings/interfaces';

export const electricboost: RitualImpl = {
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

    const player = window.api.getActivePlayerByTurnOrder({
      turnOrder: spell.caster,
    });

    const stacks = window.api.statusEffectStacks({
      player,
      statusEffectKey: 'overcharge',
    });

    window.api.setSpellStat({
      spell,
      stat: 'damage' as SpellStatImpl,
      value: spell.damage + stacks,
    });

    console.log(spell.damage, stacks, spell);

    window.api.removeStatusEffectFromPlayer({
      player,
      statusEffectKey: 'overcharge',
      value: stacks,
    });
  },
};
