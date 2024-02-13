import type { AllHelpers } from './app/helpers';

declare global {
  interface Window {
    api: typeof AllHelpers;
  }
}
