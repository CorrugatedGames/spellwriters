export type ContentType =
  | 'AIPattern'
  | 'ElementalCollision'
  | 'Relic'
  | 'SpellPattern'
  | 'SpellTag'
  | 'Spell';

export interface ContentItem {
  __contentType: ContentType;
}
