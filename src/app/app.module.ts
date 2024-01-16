import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxWebstorageModule } from 'ngx-webstorage';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ContentService } from './services/content.service';
import { GameStateService } from './services/game-state.service';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    NgxWebstorageModule.forRoot(),
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      multi: true,
      deps: [ContentService, GameStateService],
      useFactory:
        (contentService: ContentService, gameStateService: GameStateService) =>
        async () => {
          await contentService.init();
          await gameStateService.init();
        },
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
