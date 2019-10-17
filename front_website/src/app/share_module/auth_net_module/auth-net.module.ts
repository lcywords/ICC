import { NgModule, Optional, SkipSelf } from '@angular/core';
import { throwIfAlreadyLoaded } from './module-import-guard';
import { AuthService } from './auth/auth.service';
import { AuthInterceptor } from './auth/auth-interceptor';
import { AuthGuard } from './auth/auth-guard.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

@NgModule({
  providers: [
    AuthGuard,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    AuthService,
    AuthInterceptor
  ]
})
export class AuthNetModule {
  constructor( @Optional() @SkipSelf() parentModule: AuthNetModule) {
    throwIfAlreadyLoaded(parentModule, 'AuthNetModule');
  }
}

