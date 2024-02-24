import {
  type ContentItem,
  type ElementalCollisionImpl,
} from '../../../interfaces';

/**
 * The default Elemental Collision.
 *
 * @category Elemental Collision
 * @category Content Item
 */
export const plainElementalCollision: ElementalCollisionImpl & ContentItem = {
  __contentType: 'ElementalCollision',
  collide: () => {},
  collisionWinner: () => undefined,
  hasCollisionReaction: () => false,
  onSpellEnter: () => {},
  onSpellExit: () => {},
};

/**
 * The default Elemental Collision.
 *
 * @category Elemental Collision
 * @category Content Item
 *
 * @returns The default Elemental Collision.
 */
export const defaultElementalCollision: () => ElementalCollisionImpl = () => ({
  ...plainElementalCollision,
});
