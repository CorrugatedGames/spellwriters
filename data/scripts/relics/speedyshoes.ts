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

    if (!window.api.isCurrentSpellOwnedByRelicOwner({ spell, context })) return;

    const currentSpeed = spell.speed;
    if (currentSpeed <= 0) return;

    window.api.setSpellStat({
      spell,
      stat: 'speed' as SpellStatImpl,
      value: Math.max(0, currentSpeed + 1),
    });
  },
};
