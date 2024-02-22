import type {
  RitualCurrentContextRelicArgs,
  RitualImpl,
  RitualSpellDefaultArgs,
  SpellStatImpl,
} from '../../../typings/interfaces';

export const firefingers: RitualImpl = {
  ...window.api.defaultRitualRelic(),

  onSpellPlaced(
    opts: RitualSpellDefaultArgs,
    context: RitualCurrentContextRelicArgs,
  ) {
    if (!context) return;

    const { spell } = opts;
    const {
      relicContext: { owner },
    } = context;

    if (!window.api.isSpellOwnedBy({ spell, owner })) return;
    if (!window.api.isSpellElement({ spell, element: 'fire' })) return;

    const {
      relicContext: { stacks },
    } = context;

    window.api.setSpellStat({
      spell,
      stat: 'damage' as SpellStatImpl,
      value: spell.damage + stacks,
    });
  },
};
