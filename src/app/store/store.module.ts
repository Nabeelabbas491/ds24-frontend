import { NgModule, isDevMode } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { rootReducers, metaReducers } from './reducers';

@NgModule({
  imports: [
    /**
     * StoreModule.forRoot is imported once in the root module, accepting a reducer
     * function or object map of reducer functions. If passed an object of
     * reducers, combineReducers will be run creating your application
     * meta-reducer. This returns all providers for an @ngrx/store
     * based application.
     */
    StoreModule.forRoot(rootReducers, {
      metaReducers,
      runtimeChecks: {
        // strictStateImmutability and strictActionImmutability are enabled by default
        strictStateSerializability: true,
        strictActionSerializability: true,
        strictActionWithinNgZone: true,
        strictActionTypeUniqueness: true,
      },
    }),

    /**
     * @ngrx/router-store keeps router state up-to-date in the store.
     */
    StoreRouterConnectingModule.forRoot(),

    /**
     * Store devtools instrument the store retaining past versions of state
     * and recalculating new states. This enables powerful time-travel
     * debugging.
     *
     * To use the debugger, install the Redux Devtools extension for either
     * Chrome or Firefox
     *
     * See: https://github.com/zalmoxisus/redux-devtools-extension
     */
    StoreDevtoolsModule.instrument({
      name: 'NgRx Book Store App',
      // In a production build you would want to disable the Store Devtools
      logOnly: !isDevMode(),
    }),
  ],
})
export class AppStoreModule {}
