import {
  RitualCurrentContextRelicArgs,
  RitualImpl,
  RitualSpellDefaultArgs,
  SpellStatImpl,
} from '../../../interfaces';
import { defaultRitual } from '../defaults/ritual';
import { isCurrentSpellOwnedByRelicOwner } from '../ritual';
import { setSpellStat } from '../spell';

export const speedyshoes: RitualImpl = {
  ...defaultRitual(),

  onSpellPlacement(
    opts: RitualSpellDefaultArgs,
    context: RitualCurrentContextRelicArgs,
  ) {
    if (!context) return;

    const { spell } = opts;

    if (!isCurrentSpellOwnedByRelicOwner({ spell, context })) return;

    const currentSpeed = spell[SpellStatImpl.Speed];
    if (currentSpeed <= 0) return;

    setSpellStat({
      spell,
      stat: SpellStatImpl.Speed,
      value: Math.max(0, spell[SpellStatImpl.Speed] + 1),
    });
  },
};
