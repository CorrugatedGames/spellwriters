export interface ModAssetable {
  mod: string;
  asset: string;
}

export interface Spritable extends ModAssetable {
  sprite: number;
}
