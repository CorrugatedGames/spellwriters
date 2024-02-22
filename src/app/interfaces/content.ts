export type ContentType =
  | 'AIPattern'
  | 'ElementalCollision'
  | 'Relic'
  | 'SpellPattern'
  | 'SpellTag'
  | 'Spell'
  | 'StatusEffect'
  | 'TileStatus';

export interface ContentItem {
  __contentType: ContentType;
}
