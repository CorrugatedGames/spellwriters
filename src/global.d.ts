import type { AllHelpers } from '../typings/helpers';

declare global {
  interface Window {
    api: typeof AllHelpers;
  }
}
