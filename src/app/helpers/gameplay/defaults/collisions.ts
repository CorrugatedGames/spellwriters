import { type ElementalCollision } from '../../../interfaces';

export const defaultElementalCollision: ElementalCollision = {
  collide: () => {},
  collisionWinner: () => undefined,
  hasCollisionReaction: () => false,
  onSpellEnter: () => {},
  onSpellExit: () => {},
};
