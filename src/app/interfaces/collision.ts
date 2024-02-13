import { type FieldSpell } from './spell';

export interface HasCollisionReactionOpts {
  collider: FieldSpell;
  collidee: FieldSpell;
  collisionX: number;
  collisionY: number;
}

export interface CollideOpts {
  collider: FieldSpell;
  collidee: FieldSpell;
  collisionX: number;
  collisionY: number;
}

export interface CollisionWinnerOpts {
  collider: FieldSpell;
  collidee: FieldSpell;
  collisionX: number;
  collisionY: number;
}

export interface OnSpellEnterOpts {
  previousTile: { x: number; y: number };
  currentTile: { x: number; y: number };
  spell: FieldSpell;
}

export interface OnSpellExitOpts {
  currentTile: { x: number; y: number };
  nextTile: { x: number; y: number };
  spell: FieldSpell;
}

export interface ElementalCollisionImpl {
  hasCollisionReaction(opts: HasCollisionReactionOpts): boolean;
  collide(opts: CollideOpts): void;
  collisionWinner(opts: CollisionWinnerOpts): FieldSpell | undefined;
  onSpellEnter(opts: OnSpellEnterOpts): void;
  onSpellExit(opts: OnSpellExitOpts): void;
}
