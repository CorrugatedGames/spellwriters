/**
 * @group Internal
 * @internal
 * @ignore
 */
export const DEFAULT_DELAY = 1000;

/**
 * @group Internal
 * @internal
 * @ignore
 */
export async function delay(ms = DEFAULT_DELAY): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
