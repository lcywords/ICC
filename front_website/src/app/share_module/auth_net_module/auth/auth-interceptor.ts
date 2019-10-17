import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import {
  HttpClient,
  HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse,
  HttpSentEvent, HttpHeaderResponse, HttpProgressEvent, HttpResponse, HttpUserEvent,
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { mergeMap, catchError } from 'rxjs/operators';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';


/**
 * auth HTTP拦截器
 */

@Injectable()

export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private injector: Injector,
    private http: HttpClient,
    private message: NzMessageService
  ) {
  }


  private goTo(url: string) {
    setTimeout(() => this.injector.get(Router).navigateByUrl(url));
  }

  private handleData(event: HttpResponse<any> | HttpErrorResponse): Observable<any> {
    // 业务处理：一些通用操作
    console.log('---------interceptor-------------', event);
    switch (event.status) {
      case 200:
        break;
      case 400:
        console.error('400, Bad Request!');
        break;
      case 401: // 未登录状态码
        console.error('长时间未操作重新登录，转入登录页面');
        this.message.create('error', '长时间未操作, 登录过期, 请重新登录!');
        this.goTo('auth/login');
        break;
      case 402:
        console.error('402, Payment Required');
        break;
      case 403:
        console.error('403, resouces forbidden!');
        break;
      case 404:
        console.error('404, resources not found in server');
        break;
      case 405:
        console.error('405, Method Not Allowed');
        break;
      case 417:
        console.error('417, Expectation Failed');
        if (event instanceof HttpErrorResponse) {
          this.message.create('error', event.error);
        } else {
          this.message.create('error', '417, Expectation Failed');
        }
        break;
      default:
        break;
    }
    return of(event);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    console.warn('auth-----interceptor', req.url);
    if (req.url.includes('login')) {
      return next.handle(req);
    }
    return next.handle(req).pipe(
      mergeMap((event: any) => {
        // 允许统一对请求错误处理，这是因为一个请求若是业务上错误的情况下其HTTP请求的状态是200的情况下需要
        if (event instanceof HttpResponse && event.status === 200) {
          return this.handleData(event);
        }
        // 若一切都正常，则后续操作
        return of(event);
      }),
      catchError((err: HttpErrorResponse) => this.handleData(err))
    );
  }
}

