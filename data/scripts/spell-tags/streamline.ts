import type {
  FieldSpell,
  RitualCurrentContextSpellArgs,
  RitualImpl,
  RitualPhaseChangeArgs,
} from '../../../typings/interfaces';

const increaseSpeed = (spell: FieldSpell) => {
  const stacks = window.api.getSpellTagValueByKey({ spell, tag: 'streamline' });

  window.api.setSpellStat({
    spell,
    stat: 'speed',
    value: spell.speed + stacks,
  });
};

const decreaseSpeed = (spell: FieldSpell) => {
  const stacks = window.api.getSpellTagValueByKey({ spell, tag: 'streamline' });

  window.api.setSpellStat({
    spell,
    stat: 'speed',
    value: spell.speed - stacks,
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

    if (newPhase === 'SpellMove') {
      increaseSpeed(context.spellContext.spell);
    }

    if (oldPhase === 'SpellMove') {
      decreaseSpeed(context.spellContext.spell);
    }
  },
};
