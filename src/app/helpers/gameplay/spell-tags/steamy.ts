import { SpellTagImpl, SpellTagSpaceArgs } from '../../../interfaces';
import { getSpellTagByKey } from '../../lookup/spell-tags';
import { defaultSpellTag } from '../defaults/spell-tags';
import { elementKeyToFieldElement, setFieldElement } from '../field';
import { setSpellTag } from '../spell';

export const steamy: SpellTagImpl = {
  ...defaultSpellTag,

  onSpaceExited: (opts: SpellTagSpaceArgs) => {
    const { spell, x, y } = opts;

    setFieldElement({
      x,
      y,
      element: elementKeyToFieldElement({
        elementKey: 'steam',
        caster: spell.caster,
      }),
    });

    const tag = getSpellTagByKey('steamy')?.id;
    if (!tag) return;

    const steamyDuration = spell.tags[tag] ?? 1;
    setSpellTag({ spell, tag, value: Math.max(0, steamyDuration - 1) });
  },
};
