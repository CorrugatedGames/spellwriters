import {
  type CollideOpts,
  type CollisionWinnerOpts,
  type ElementalCollision,
  type FieldSpell,
  type HasCollisionReactionOpts,
} from '../../../interfaces';
import { getElementByKey, getElementKey } from '../../lookup/elements';
import { getSpellByName } from '../../lookup/spells';
import { defaultElementalCollision } from '../defaults/collisions';
import { moveSpellToPosition, spellToFieldSpell } from '../field';
import { defaultShouldFieldElementBeCreated } from '../spell';

function hasCollisionReaction(opts: HasCollisionReactionOpts): boolean {
  const { collider, collidee } = opts;
  const elements = [
    getElementKey(collider.element),
    getElementKey(collidee.element),
  ];

  return elements.includes('earth') && elements.includes('electric');
}

function collide(opts: CollideOpts): void {
  const { collider, collidee, collisionX, collisionY } = opts;
  if (!defaultShouldFieldElementBeCreated({ collider, collidee })) return;

  const hitNearbyTile = (x: number, y: number): void => {
    const spellInst = getSpellByName('Electric Explosion');
    if (!spellInst) return;

    const elementRef = getElementByKey('earth');
    if (!elementRef) return;

    const fieldSpellInst = spellToFieldSpell({
      spell: {
        ...spellInst,
        element: elementRef.id,
      },
      caster: collider.caster,
    });

    moveSpellToPosition({
      spell: fieldSpellInst,
      currentX: collisionX,
      currentY: collisionY,
      nextX: x,
      nextY: y,
      disallowEntryIntoNextTile: true,
    });
  };

  hitNearbyTile(collisionX - 1, collisionY);
  hitNearbyTile(collisionX + 1, collisionY);
}

function collisionWinner(opts: CollisionWinnerOpts): FieldSpell | undefined {
  const { collider, collidee } = opts;
  const colliderElement = getElementKey(collider.element);
  const collideeElement = getElementKey(collidee.element);

  if (colliderElement === 'electric' && collideeElement === 'electric')
    return undefined;

  if (collideeElement === 'electric') return collider;
  if (colliderElement === 'electric') return collidee;

  return undefined;
}

export const terraelectricity: ElementalCollision = {
  ...defaultElementalCollision,
  hasCollisionReaction,
  collide,
  collisionWinner,
};
