import { isDevMode } from '@angular/core';

export const environment = {
  rollbar: {
    token: '443c1a4630084b49bf7dbe749708801b',
    environment: isDevMode() ? 'local' : 'production',
  },
  gameanalytics: {
    platform: 'web',
    game: '6af5f5dbf5c8e0f7312ca0ab6bf34735',
    key: '04ac4c38b97823eefe8859edac9a50c72a1341b5',
  },
};
