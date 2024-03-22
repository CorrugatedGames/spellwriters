import type {
  FieldSpell,
  RitualCurrentContextSpellArgs,
  RitualImpl,
  RitualPhaseChangeArgs,
} from '../../../typings/interfaces';

const increaseSpeed = (spell: FieldSpell) => {
  const stacks = window.api.getSpellTagValueByKey({ spell, tag: 'streamline' });

  window.api.setSpellSpeed({
    spell,
    speed: spell.speed + stacks,
  });
};

const decreaseSpeed = (spell: FieldSpell) => {
  const stacks = window.api.getSpellTagValueByKey({ spell, tag: 'streamline' });

  window.api.setSpellSpeed({
    spell,
    speed: spell.speed - stacks,
  });

  window.api.setSpellTagByKey({ spell, tag: 'streamline', value: 0 });
};

export const streamline: RitualImpl = {
  ...window.api.defaultRitualSpellTag(),

  onCombatPhaseChange(
    opts: RitualPhaseChangeArgs,
    context: RitualCurrentContextSpellArgs,
  ) {
    const { oldPhase, newPhase, newTurn } = opts;

    if (newTurn !== context.spellContext.spell.caster) return;

    if (newPhase === 'PreSpellMove') {
      increaseSpeed(context.spellContext.spell);
    }

    if (newPhase === 'PostSpellMove') {
      decreaseSpeed(context.spellContext.spell);
    }
  },
};
