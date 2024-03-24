import { APP_INITIALIZER, ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxWebstorageModule } from 'ngx-webstorage';

import { HttpClientModule } from '@angular/common/http';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { HotkeyModule } from 'angular2-hotkeys';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DebugPanelComponent } from './components/debug/debug-panel/debug-panel.component';
import { AnalyticsService } from './services/analytics.service';
import { CombatStateService } from './services/combat-state.service';
import { ContentService } from './services/content.service';
import { GameStateService } from './services/game-state.service';
import { KeymapService } from './services/hotkeys.service';
import { MetaService } from './services/meta.service';
import { ModAPIService } from './services/modapi.service';
import {
  RollbarErrorHandler,
  RollbarService,
} from './services/rollbar.service';

@NgModule({
  declarations: [AppComponent, DebugPanelComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgxWebstorageModule.forRoot({
      prefix: 'spellwriters',
    }),
    AngularSvgIconModule.forRoot(),
    HotkeyModule.forRoot(),
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      multi: true,
      deps: [
        MetaService,
        AnalyticsService,
        RollbarService,
        ModAPIService,
        ContentService,
        GameStateService,
        CombatStateService,
        KeymapService,
      ],
      useFactory:
        (
          metaService: MetaService,
          analyticsService: AnalyticsService,
          rollbarService: RollbarService,
          modApiService: ModAPIService,
          contentService: ContentService,
          gameStateService: GameStateService,
          combatStateService: CombatStateService,
          hotkeysService: KeymapService,
        ) =>
        async () => {
          await metaService.init();
          await analyticsService.init();
          await rollbarService.init();
          await modApiService.init();
          await contentService.init();
          await gameStateService.init();
          await combatStateService.init();
          await hotkeysService.init();
        },
    },

    { provide: ErrorHandler, useClass: RollbarErrorHandler },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
