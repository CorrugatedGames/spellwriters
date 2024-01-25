import { GameState } from './gamestate';
import { FieldSpell } from './spell';

export interface ElementalCollision {
  hasCollisionReaction(collider: FieldSpell, collidee: FieldSpell): boolean;

  collide(
    gamestate: GameState,
    collider: FieldSpell,
    collidee: FieldSpell,
  ): void;

  collisionWinner(
    collider: FieldSpell,
    collidee: FieldSpell,
  ): FieldSpell | undefined;

  onSpellEnter(gamestate: GameState, spell: FieldSpell): void;
  onSpellExit(gamestate: GameState, spell: FieldSpell): void;
}
