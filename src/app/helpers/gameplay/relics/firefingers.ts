import {
  RitualCurrentContextRelicArgs,
  RitualImpl,
  RitualSpellDefaultArgs,
  SpellStatImpl,
} from '../../../interfaces';
import { defaultRitual } from '../defaults/ritual';
import { isCurrentSpellOwnedByRelicOwner } from '../ritual';
import { isSpellElement, setSpellStat } from '../spell';

export const firefingers: RitualImpl = {
  ...defaultRitual(),

  onSpellPlacement(
    opts: RitualSpellDefaultArgs,
    context: RitualCurrentContextRelicArgs,
  ) {
    if (!context) return;

    const { spell } = opts;

    if (!isCurrentSpellOwnedByRelicOwner({ spell, context })) return;
    if (!isSpellElement({ spell, element: 'fire' })) return;

    const {
      relicContext: { stacks },
    } = context;

    setSpellStat({
      spell,
      stat: SpellStatImpl.Damage,
      value: spell[SpellStatImpl.Damage] + stacks,
    });
  },
};
