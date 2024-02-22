import type {
  RitualCurrentContextRelicArgs,
  RitualImpl,
  RitualPhaseChangeArgs,
} from '../../../typings/interfaces';

export const staticnecklace: RitualImpl = {
  ...window.api.defaultRitualRelic(),

  onCombatPhaseChange(
    opts: RitualPhaseChangeArgs,
    context: RitualCurrentContextRelicArgs,
  ) {
    const { newPhase } = opts;

    const {
      relicContext: { owner },
    } = context;

    if (newPhase !== 'SpellMove') return;
    if (!window.api.isCurrentTurn({ player: owner })) return;

    const spellsCast = owner.spellsCastThisTurn;
    if (spellsCast !== 0) return;

    window.api.addStatusEffectToPlayer({
      player: owner,
      statusEffectKey: 'overcharge',
      value: 1,
    });
  },
};
