import { SpellTagImpl, SpellTagSpaceArgs } from '../../../interfaces';
import { getSpellTagByKey } from '../../lookup/spell-tags';
import { defaultSpellTag } from '../defaults/spell-tags';
import { elementKeyToFieldElement, setFieldElement } from '../field';
import { setSpellTag } from '../spell';

export const muddy: SpellTagImpl = {
  ...defaultSpellTag,

  onSpaceExited: (opts: SpellTagSpaceArgs) => {
    const { spell, x, y } = opts;

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
