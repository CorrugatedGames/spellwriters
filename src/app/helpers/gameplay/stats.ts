import { ActivePlayer, Spell } from '../../interfaces';
import { callRitualGlobalFunction } from './ritual';

export function setMana(opts: {
  character: ActivePlayer;
  amount: number;
}): void {
  const { character, amount } = opts;

  character.mana = Math.max(0, Math.min(amount, character.maxMana));
}

export function gainMana(opts: {
  character: ActivePlayer;
  amount: number;
}): void {
  const { character, amount } = opts;
  setMana({ character, amount: character.mana + amount });

  callRitualGlobalFunction({
    func: 'onPlayerGainMana',
    funcOpts: { character, mana: amount },
  });
}

export function spendMana(opts: {
  character: ActivePlayer;
  amount: number;
}): void {
  const { character, amount } = opts;
  setMana({ character, amount: character.mana - amount });

  callRitualGlobalFunction({
    func: 'onPlayerLoseMana',
    funcOpts: { character, mana: amount },
  });
}

export function manaCostForSpell(opts: {
  character: ActivePlayer;
  spell: Spell;
}): number {
  const { character, spell } = opts;
  return spell.cost + character.spellsCastThisTurn;
}

export function setHealth(opts: {
  character: ActivePlayer;
  amount: number;
}): void {
  const { character, amount } = opts;

  character.health = Math.max(0, Math.min(amount, character.maxHealth));
}

export function gainHealth(opts: {
  character: ActivePlayer;
  amount: number;
}): void {
  const { character, amount } = opts;
  setHealth({ character, amount: character.health + amount });

  callRitualGlobalFunction({
    func: 'onPlayerGainHealth',
    funcOpts: { character, health: amount },
  });
}

export function loseHealth(opts: {
  character: ActivePlayer;
  amount: number;
}): void {
  const { character, amount } = opts;
  setHealth({ character, amount: character.health - amount });

  callRitualGlobalFunction({
    func: 'onPlayerLoseHealth',
    funcOpts: { character, health: amount },
  });
}
