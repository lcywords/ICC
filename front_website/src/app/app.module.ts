import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgZorroAntdModule, NZ_I18N, zh_CN } from 'ng-zorro-antd';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { LoginModule } from './pages/login/login.module';
import { PageModule } from './pages/pages.module';
import { SharedModule } from './share_module/shared.module';
import { APP_CONFIG, APP_DI_CONFIG } from 'src/config/config';
import { BASE_PATH } from './middleware/api_service';

registerLocaleData(zh);

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgZorroAntdModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    LoginModule,
    PageModule,
    AppRoutingModule,
    SharedModule
  ],
  providers: [
    { provide: NZ_I18N, useValue: zh_CN },
    // AuthService,
    // AuthGuard,
    // { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: APP_CONFIG, useValue: APP_DI_CONFIG },
    { provide: BASE_PATH, useValue: APP_DI_CONFIG.basePath }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  // constructor(
  //   @Inject(PLATFORM_ID) private platformId: any,
  //   @Inject(APP_ID) private appId: string,
  //   router: Router
  // ) {
  //   const platform = isPlatformBrowser(platformId) ?
  //     'in the browser' : 'on the server';
  //   console.log(`Running ${platform} with appId=${appId}`);

  //   // if (this.checkLogin()) {
  //   //   router.navigate(['/login']);
  //   // }
  // }

  // // 未登录状态只能进入登录页
  // checkLogin(): boolean {
  //   // console.log('app module init');
  //   if (sessionStorage.getItem('sessionId') === null) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }
}
