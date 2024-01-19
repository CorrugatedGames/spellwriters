import { ActivePlayer } from '../../interfaces';

export function gainMana(character: ActivePlayer, amount = 1) {
  character.mana = Math.max(
    0,
    Math.min(character.mana + amount, character.maxMana),
  );
}

export function spendMana(character: ActivePlayer, amount = 1) {
  gainMana(character, -amount);
}
