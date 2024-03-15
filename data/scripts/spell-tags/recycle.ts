import type {
  RitualCurrentContextSpellArgs,
  RitualImpl,
  RitualSpellDamageArgs,
} from '../../../typings/interfaces';

export const recycle: RitualImpl = {
  ...window.api.defaultRitualSpellTag(),

  onSpellDealDamage(
    opts: RitualSpellDamageArgs,
    context: RitualCurrentContextSpellArgs,
  ) {
    if (!context) return;
    if (!window.api.isCurrentSpellContextSpell({ funcOpts: opts, context }))
      return;

    const {
      spellContext: { spell },
    } = context;

    const activePlayer = window.api.getActivePlayerByTurnOrder({
      turnOrder: spell.caster,
    });
    if (!activePlayer) return;

    const discard = activePlayer.discard;

    const recycledCard = discard.find((card) => card.spellId === spell.id);
    if (!recycledCard) return;

    window.api.addCardToHand({
      card: recycledCard,
      character: activePlayer,
    });
    window.api.removeCardFromDiscard({
      card: recycledCard,
      character: activePlayer,
    });
  },
};
