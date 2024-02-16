import { APP_INITIALIZER, ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxWebstorageModule } from 'ngx-webstorage';

import { HttpClientModule } from '@angular/common/http';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AnalyticsService } from './services/analytics.service';
import { ContentService } from './services/content.service';
import { GameStateService } from './services/game-state.service';
import { MetaService } from './services/meta.service';
import { ModAPIService } from './services/modapi.service';
import {
  RollbarErrorHandler,
  RollbarService,
} from './services/rollbar.service';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgxWebstorageModule.forRoot({
      prefix: 'spellwriters',
    }),
    AngularSvgIconModule.forRoot(),
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
      ],
      useFactory:
        (
          metaService: MetaService,
          analyticsService: AnalyticsService,
          rollbarService: RollbarService,
          modApiService: ModAPIService,
          contentService: ContentService,
          gameStateService: GameStateService,
        ) =>
        async () => {
          await metaService.init();
          await analyticsService.init();
          await rollbarService.init();
          await modApiService.init();
          await contentService.init();
          await gameStateService.init();
        },
    },

    { provide: ErrorHandler, useClass: RollbarErrorHandler },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
