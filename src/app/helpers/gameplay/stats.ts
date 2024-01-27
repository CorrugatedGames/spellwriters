import { ActivePlayer, Spell } from '../../interfaces';

export function gainMana(opts: {
  character: ActivePlayer;
  amount: number;
}): void {
  const { character, amount } = opts;

  character.mana = Math.max(
    0,
    Math.min(character.mana + (amount ?? 1), character.maxMana),
  );
}

export function spendMana(opts: {
  character: ActivePlayer;
  amount: number;
}): void {
  const { character, amount } = opts;

  gainMana({ character, amount: -amount });
}

export function manaCostForSpell(opts: {
  character: ActivePlayer;
  spell: Spell;
}): number {
  const { character, spell } = opts;
  return spell.cost + character.spellsCastThisTurn;
}

export function gainHealth(opts: {
  character: ActivePlayer;
  amount: number;
}): void {
  const { character, amount } = opts;

  character.health = Math.max(
    0,
    Math.min(character.health + (amount ?? 1), character.maxHealth),
  );
}

export function loseHealth(opts: {
  character: ActivePlayer;
  amount: number;
}): void {
  const { character, amount } = opts;

  gainHealth({ character, amount: -amount });
}
