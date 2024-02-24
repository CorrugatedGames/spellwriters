import { type IDiscordPresenceOpts } from '../../interfaces';

/**
 * Whether or not the game is running in an Electron environment.
 *
 * @category Native
 * @returns boolean
 */
export function isInElectron(): boolean {
  return navigator.userAgent.toLowerCase().includes(' electron/');
}

let discordMainStatus = '';

/**
 * Set the main status for the Discord Rich Presence.
 *
 * @category Native
 * @param status - The status to set.
 */
export function setMainDiscordStatus(status: string): void {
  discordMainStatus = status;
}

/**
 * Set the Discord Rich Presence status.
 *
 * @category Native
 * @param status - The status to set.
 */
export function setDiscordStatus(status: IDiscordPresenceOpts): void {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).discordRPCStatus = {
    ...status,
    details: discordMainStatus || status.details,
  };
}
