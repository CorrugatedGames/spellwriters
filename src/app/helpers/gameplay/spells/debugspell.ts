import {
  type RitualCurrentContextSpellArgs,
  type RitualImpl,
  SpellStatImpl,
  type SpellTagSpaceArgs,
} from '../../../interfaces';
import { defaultRitual } from '../defaults/ritual';
import { isCurrentSpellContextSpell } from '../ritual';
import { setSpellStat } from '../spell';

export const debugspell: RitualImpl = {
  ...defaultRitual(),

  onSpellPlacement: (
    opts: SpellTagSpaceArgs,
    context: RitualCurrentContextSpellArgs,
  ) => {
    if (!context) return;
    if (!isCurrentSpellContextSpell({ funcOpts: opts, context })) return;

    const {
      spellContext: { spell },
    } = context;

    setSpellStat({
      spell,
      stat: SpellStatImpl.Damage,
      value: spell[SpellStatImpl.Damage] + 3,
    });
  },
};
