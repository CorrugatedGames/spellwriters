import type {
  RitualCurrentContextRelicArgs,
  RitualImpl,
  RitualSpellDefaultArgs,
  SpellStatImpl,
} from '../../../typings/interfaces';

export const speedyshoes: RitualImpl = {
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

    const currentSpeed = spell.speed;

    window.api.setSpellStat({
      spell,
      stat: 'speed' as SpellStatImpl,
      value: Math.max(0, currentSpeed + 1),
    });
  },
};
