import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Md5 } from 'ts-md5/dist/md5';

import { NzMessageService } from 'ng-zorro-antd';

import { CurrentUser } from '../interface/current-user';

import { docCookies } from '../util/getCookie';
import { redisSessionTime } from 'src/global.config';

@Injectable()
export class AuthService {
  constructor(
    private http: HttpClient,
    private route: Router,
    private nzMs: NzMessageService
  ) {

  }

  public isLogin = !sessionStorage.getItem('sessionId') ? false : true;
  private sessionId: string;
  private currentUser: CurrentUser = {
    username: sessionStorage.getItem('username') || '',
    password: '',
    sessionId: sessionStorage.getItem('sessionId') || '',
    user_id: sessionStorage.getItem('user_id') || '',
    user_name: sessionStorage.getItem('user_name') || '',
    institution_id: sessionStorage.getItem('institution_id') || '',
    institution_name: sessionStorage.getItem('institution_name') || '',
  };

  public loginStatusWs;

  public isLoginCheckByDipper = false;

  // store the URL so we can redirect after logging in
  redirectUrl: string;

  // tslint:disable-next-line:max-line-length
  setCurrentUser = (name: string, pwd: string, sessionId: string, userId: string, userName: string, institutionId: string, institutionName: string) => {
    this.currentUser.username = name;
    this.currentUser.password = pwd;
    this.currentUser.sessionId = sessionId;
    this.currentUser.user_id = userId;
    this.currentUser.user_name = userName;
    this.currentUser.institution_id = institutionId;
    this.currentUser.institution_name = institutionName;
  }

  // 获取当前用户
  getCurrentUser = () => {
    return this.currentUser;
  }

  // 清除用户信息
  clearCurrentUser = () => {
    this.currentUser.username = '';
    this.currentUser.password = '';
    this.currentUser.sessionId = '';
    this.clearsessionStorage();
    this.clearCookie();
  }

  // tslint:disable-next-line:max-line-length
  setSessionStorage = (institutionId: string, institutionName: string, sessionId: string, userId: string, userName: string, userType, lastLoginTime: string) => {
    sessionStorage.setItem('institution_id', institutionId);
    sessionStorage.setItem('institution_name', institutionName);
    sessionStorage.setItem('sessionId', sessionId);
    sessionStorage.setItem('last_login_time', lastLoginTime);
    sessionStorage.setItem('user_id', userId);
    sessionStorage.setItem('user_name', userName);
    sessionStorage.setItem('user_type', userType);
  }

  // 删除session
  clearsessionStorage = () => {
    sessionStorage.removeItem('institution_id');
    sessionStorage.removeItem('institution_name');
    sessionStorage.removeItem('sessionId');
    sessionStorage.removeItem('user_id');
    sessionStorage.removeItem('user_name');
    sessionStorage.removeItem('user_type');
  }

  // 清除cookie
  clearCookie = () => {
    docCookies.removeItem('session_id');
  }

  // 获取sessionId
  getAuthorizationToken = () => {
    return sessionStorage.getItem('sessionId');
  }

  // 跳转登录页面
  public gotoLogin() {
    this.clearCurrentUser();
    this.isLogin = this.isLoginCheckByDipper = false;
    if (this.loginStatusWs) {
      this.loginStatusWs.complete();
      this.loginStatusWs = null;
    }
    setTimeout(() => this.route.navigate(['/login']), 1000);
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  // 路由拦截
  checkLogin(): boolean {
    const lastLoginTime = +sessionStorage.getItem('last_login_time');
    const currentNow = Date.now();
    const durationSeconds = Math.trunc((currentNow - lastLoginTime) / 1000);
    console.log('last login duration seconds', durationSeconds);
    if (sessionStorage.getItem('sessionId') !== '' && this.isLogin && durationSeconds < redisSessionTime) { // session 未过期， redis 3600;
      // return true;
      if (sessionStorage.getItem('sessionId') !== docCookies.getItem('session_id')) {
        this.nzMs.warning('检测到登录信息变更，请重新登录');
      }
      return sessionStorage.getItem('sessionId') === docCookies.getItem('session_id');
    }
    sessionStorage.removeItem('sessionId');
    return false;
  }

  //// --------------->>>>>>>>>>>>>>
  // 登录
  login(userName: string, password: string): Observable<any> {
    const md5Pwd = String(Md5.hashStr(password));
    return this.http.post('/dt_monitor/api/login', {
      username: userName,
      user_password: md5Pwd
    }).pipe(
      tap(
        res => {
          this.isLogin = true;
          const sessionId = res['token'];
          this.sessionId = sessionId;
          this.setCurrentUser(userName, password, '', res['user_id'], res['user_name'], res['institution_id'], res['institution_name']);
          this.setSessionStorage(res['institution_id'], res['institution_name'], sessionId, res['user_id'], res['user_name'],
            res['user_type'], String(Date.now()));
          if (this.loginStatusWs) {
            this.loginStatusWs.complete();
            this.loginStatusWs = null;
          }
        },
        error => {
          this.isLogin = false;
        }
      )
    );
  }

  // 获取机构列表
  getInstitutionList = (institutionId = '') => {
    return this.http.post('/dt_monitor/api/get_institution_list', { institution_id: institutionId }).pipe(
      tap(
        res => {
          this.isLogin = true;
        },
        error => {
          this.isLogin = false;
        }
      )
    );
  }

  // 获取用户列表
  getUserList = () => {
    return this.http.get('/dt_monitor/api/users').pipe(
      tap(
        res => {
          this.isLogin = true;
        },
        error => {
          this.isLogin = false;
        }
      )
    );
  }

  // 获取专家列表
  getExpertsList = () => {
    return this.http.get('/dt_monitor/api/expert').pipe(
      tap(
        res => {
          this.isLogin = true;
        },
        error => {
          this.isLogin = false;
        }
      )
    );
  }

  // 退出
  logout(username: string, pwd: string): Observable<any> {
    const md5Pwd = String(Md5.hashStr(pwd));
    return this.http.get('/dt_monitor/api/logout', {
      headers: new HttpHeaders().set('username', username).set('password', md5Pwd),
      observe: 'response'
    }).pipe(
      tap(
        res => {
          this.isLogin = false;
          this.isLoginCheckByDipper = false;
          this.sessionId = null;
          this.clearCurrentUser();
        }),
      catchError(this.handleError('log out error', []))
    );
  }

  // 添加机构
  addInstitution(data: any): Observable<any> {
    return this.http.post('/dt_monitor/api/add_institution', data).pipe(
      tap(
        res => {
          this.isLogin = true;
        },
        error => {
          this.isLogin = false;
        },
        () => {
          console.log('com');
        })
    );
  }

  // 编辑机构
  editInstitution(data: any): Observable<any> {
    return this.http.post('/dt_monitor/api/edit_institution', data).pipe(
      tap(
        res => {
          this.isLogin = true;
        },
        error => {
          this.isLogin = false;
        },
        () => {
          console.log('com');
        })
    );
  }

  // 获取机构及其子机构
  getInstitutionAndChildList(id: string): Observable<any> {
    const url = '/dt_monitor/api/get_institution_and_child_list?institution_id=' + id;
    return this.http.get(url).pipe(
      tap(
        res => {
          this.isLogin = true;
        },
        error => {
          this.isLogin = false;
        })
    );
  }

  // setInstitutionAndChildList(data, chilren): Observable<any> {
  //   const url = '/dt_monitor/api/set_institutionInfo';
  //   return this.http.post(url, {
  //     institution_id: data['institution_id'],
  //     institution_name: data['institution_name'],
  //     institution_manager: data['institution_manager'],
  //     is_share_data: data['is_share_data'],
  //     children: chilren
  //   }).pipe(
  //     tap(
  //       res => {
  //         this.isLogin = true;
  //       },
  //       error => {
  //         this.isLogin = false;
  //       })
  //   );
  // }

  // 删除机构
  deleteInstitution(deleteIdList): Observable<any> {
    return this.http.post('/dt_monitor/api/delete_institution', {
      institution_id_list: deleteIdList
    }).pipe(
      tap(
        res => {
          this.isLogin = true;
        },
        error => {
          this.isLogin = false;
        })
    );
  }

  // 新增用户
  addNewUser = (data: any) => {
    return this.http.post('/dt_monitor/api/add_user', data);
  }

  // 编辑用户信息
  getUserDetail = (id: string) => {
    const url = '/dt_monitor/api/user_details/' + id;
    return this.http.get(url);
  }


  // 新增专家用户
  addNewExpert = (data: any) => {
    return this.http.post('/dt_monitor/api/add_expert', data);
  }

  // 获取专家详情
  getExpertDetail = (id: string) => {
    const url = '/dt_monitor/api/expert_details/' + id;
    return this.http.get(url);
  }

  // 更新用户信息
  updateProductData = (id: string, productList: any) => {
    return this.http.post('/dt_monitor/api/update_user_product/' + id, productList);

  }

  // 改变用户密码
  changeUserPassword = (userId: string, userPassword: string) => {
    const md5Pwd = String(Md5.hashStr(userPassword));
    return this.http.put('/dt_monitor/api/change_user_password/' + userId, {
      user_password: md5Pwd
    });
  }

  // 改变用户电话号码
  changeUserNumber = (id: string, values: any) => {
    return this.http.post('/dt_monitor/api/zuser/' + id, values);
  }

  // 获取机构用户
  getInstitutionUsers(id: string): Observable<any> {
    const url = '/dt_monitor/api/institution/' + id + '/users';
    return this.http.get(url).pipe(
      tap(
        res => {
          this.isLogin = true;
        },
        error => {
          this.isLogin = false;
        })
    );
  }

  // 获取机构病人
  getInstitutionPatients(id: string): Observable<any> {
    const url = '/dt_monitor/api/institution/' + id + '/patients';
    return this.http.get(url).pipe(
      tap(
        res => {
          this.isLogin = true;
        },
        error => {
          this.isLogin = false;
        })
    );
  }

  // 编辑用户
  EditUser(data: any): Observable<any> {
    return this.http.post('/dt_monitor/api/edit_user', data);
  }

  // 删除用户
  DeleteUser(userId: string): Observable<any> {
    const url = '/dt_monitor/api/delete_user/' + userId;
    return this.http.get(url).pipe(
      tap(
        res => {
          this.isLogin = true;
        },
        error => {
          this.isLogin = false;
        })
    );
  }

  // 添加用户组
  AddUserGroup(data: any): Observable<any> {
    return this.http.post('/dt_monitor/api/add_user_group', data);
  }

  // 编辑用户组
  EditUserGroup(data: any): Observable<any> {
    return this.http.post('/dt_monitor/api/edit_user_group', data);
  }

  // 获取用户组列表
  GetUserGroupList(): Observable<any> {
    const url = '/dt_monitor/api/get_user_group_list';
    return this.http.get(url).pipe(
      tap(
        res => {
          this.isLogin = true;
        },
        error => {
          this.isLogin = false;
        })
    );
  }

  // 删除用户组
  DeleteUserGroup(groupId: string): Observable<any> {
    return this.http.post('/dt_monitor/api/delete_user_group', {
      _id: groupId
    });
  }

}

