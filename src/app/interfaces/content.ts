export type ContentType =
  | 'AIPattern'
  | 'ElementalCollision'
  | 'Relic'
  | 'SpellPattern'
  | 'SpellTag'
  | 'Spell'
  | 'TileStatus';

export interface ContentItem {
  __contentType: ContentType;
}
