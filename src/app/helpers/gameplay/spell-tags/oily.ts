import { SpellTagImpl, SpellTagSpaceArgs } from '../../../interfaces';
import { getSpellTagByKey } from '../../lookup/spell-tags';
import { defaultSpellTag } from '../defaults/spell-tags';
import { elementKeyToFieldElement, setFieldElement } from '../field';
import { setSpellTag } from '../spell';

export const oily: SpellTagImpl = {
  ...defaultSpellTag,

  onSpaceExited: (opts: SpellTagSpaceArgs) => {
    const { spell, x, y } = opts;

    setFieldElement({
      x,
      y,
      element: elementKeyToFieldElement({
        elementKey: 'oil',
        caster: spell.caster,
      }),
    });

    const tag = getSpellTagByKey('oily')?.id;
    if (!tag) return;

    const oilyDuration = spell.tags[tag] ?? 1;
    setSpellTag({ spell, tag, value: Math.max(0, oilyDuration - 1) });
  },
};
