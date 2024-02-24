import { type FieldSpell } from './spell';

/**
 * @category Elemental Collision
 */
export interface HasCollisionReactionOpts {
  collider: FieldSpell;
  collidee: FieldSpell;
  collisionX: number;
  collisionY: number;
}

/**
 * @category Elemental Collision
 */
export interface CollideOpts {
  collider: FieldSpell;
  collidee: FieldSpell;
  collisionX: number;
  collisionY: number;
}

/**
 * @category Elemental Collision
 */
export interface CollisionWinnerOpts {
  collider: FieldSpell;
  collidee: FieldSpell;
  collisionX: number;
  collisionY: number;
}

/**
 * @category Elemental Collision
 */
export interface OnSpellEnterOpts {
  previousTile: { x: number; y: number };
  currentTile: { x: number; y: number };
  spell: FieldSpell;
}

/**
 * @category Elemental Collision
 */
export interface OnSpellExitOpts {
  currentTile: { x: number; y: number };
  nextTile: { x: number; y: number };
  spell: FieldSpell;
}

/**
 * @category Elemental Collision
 * @category Modding
 */
export interface ElementalCollisionImpl {
  hasCollisionReaction(opts: HasCollisionReactionOpts): boolean;
  collide(opts: CollideOpts): void;
  collisionWinner(opts: CollisionWinnerOpts): FieldSpell | undefined;
  onSpellEnter(opts: OnSpellEnterOpts): void;
  onSpellExit(opts: OnSpellExitOpts): void;
}
