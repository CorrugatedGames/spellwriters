/**
 * @internal
 */
export interface ModAssetable {
  /**
   * The mod that the asset is from.
   *
   * @example "default"
   */
  mod: string;

  /**
   * The path to the asset in the mod.
   *
   * @example characters.webp
   */
  asset: string;
}

/**
 * @internal
 */
export interface Spritable extends ModAssetable {
  /**
   * The sprite number in the sprite sheet.
   *
   * @example 0
   */
  sprite: number;
}
