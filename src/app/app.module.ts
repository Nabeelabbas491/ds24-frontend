import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DsSnackbarModule } from '@ds24/elements';

import { AppRouterModule } from './router/router.module';
import { AppComponent } from './app.component';
import { AppStoreModule } from './store/store.module';
import { AppEffectsModule } from './effects/effects.module';
import { LayoutFeatureModule } from './features/layout/layout.module';
import { TranslationModule } from './translations/translations.module';
import { authInterceptorProvider } from './shared/interceptor/auth.interceptor.service';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,

    LayoutFeatureModule,

    AppStoreModule,
    AppRouterModule,
    AppEffectsModule,
    TranslationModule,

    DsSnackbarModule,
  ],
  providers: [authInterceptorProvider],
  bootstrap: [AppComponent],
})
export class AppModule {}
