import {
  type RitualCurrentContextSpellArgs,
  type RitualImpl,
  type SpellTagSpaceArgs,
} from '../../../interfaces';
import { getSpellTagByKey } from '../../lookup/spell-tags';
import { defaultRitual } from '../defaults/ritual';
import { elementKeyToFieldElement, setFieldElement } from '../field';
import { isCurrentSpellContextSpell } from '../ritual';
import { setSpellTag } from '../spell';

export const muddy: RitualImpl = {
  ...defaultRitual(),

  onSpellSpaceExited: (
    opts: SpellTagSpaceArgs,
    context: RitualCurrentContextSpellArgs,
  ) => {
    if (!context) return;
    if (!isCurrentSpellContextSpell({ funcOpts: opts, context })) return;

    const { x, y } = opts;
    const {
      spellContext: { spell },
    } = context;

    setFieldElement({
      x,
      y,
      element: elementKeyToFieldElement({
        elementKey: 'mud',
        caster: spell.caster,
      }),
    });

    const tag = getSpellTagByKey('muddy')?.id;
    if (!tag) return;

    const muddyDuration = spell.tags[tag] ?? 1;
    setSpellTag({ spell, tag, value: Math.max(0, muddyDuration - 1) });
  },
};
