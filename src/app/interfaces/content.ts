/**
 * @internal
 */
export type ContentType =
  | 'AIPattern'
  | 'ElementalCollision'
  | 'Relic'
  | 'SpellPattern'
  | 'SpellTag'
  | 'Spell'
  | 'StatusEffect'
  | 'TileStatus';

/**
 * @internal
 */
export interface ContentItem {
  __contentType: ContentType;
}
