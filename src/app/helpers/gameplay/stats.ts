import { ActivePlayer, Spell } from '../../interfaces';

export function gainMana(character: ActivePlayer, amount = 1): void {
  character.mana = Math.max(
    0,
    Math.min(character.mana + amount, character.maxMana),
  );
}

export function spendMana(character: ActivePlayer, amount = 1): void {
  gainMana(character, -amount);
}

export function manaCostForSpell(
  character: ActivePlayer,
  spell: Spell,
): number {
  return spell.cost + character.spellsCastThisTurn;
}

export function gainHealth(character: ActivePlayer, amount = 1): void {
  character.health = Math.max(
    0,
    Math.min(character.health + amount, character.maxHealth),
  );
}

export function loseHealth(character: ActivePlayer, amount = 1): void {
  gainHealth(character, -amount);
}
