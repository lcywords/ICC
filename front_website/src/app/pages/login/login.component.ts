import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, } from '@angular/forms';

import { Md5 } from 'ts-md5/dist/md5';

import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NzModalService } from 'ng-zorro-antd';
import { AuthService } from 'src/app/share_module/auth_net_module/auth/auth.service';
// import { AuthService } from 'src/app/core/auth/auth.service';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less'],
})

export class LoginComponent implements OnInit {

  public loginForm: FormGroup;

  private usernameReg = /^[\w|\d]{3,20}$/;
  private passwordReg = /^\S{1,20}$/;
  // tslint:disable-next-line:variable-name
  public _loading: boolean;

  public errorMsg;
  public remember: boolean;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private authService: AuthService,
    private confirmServ: NzModalService,
    private router: Router,
  ) {

  }

  async onLogin() {
    const username = this.loginForm.controls.username.value;
    const password = this.loginForm.controls.password.value;
    if (username && username !== 'datu_super_admin') {
      alert('权限不够，请与管理员联系！');
      return;
    }

    if (this.loginForm.invalid) {
      this.confirmServ.warning({
        nzTitle: '错误',
        nzContent: '用户名或密码错误!'
      });
      return;
    }
    this.router.navigate(['/admin/echart']);
    // this.authService.login(username, password)
    //   .subscribe(
    //     res => {
    //       setTimeout(() => {
    //         this._loading = false;
    //       }, 1000);
    //       if (this.authService.isLogin) {
    //         this.router.navigate(['/admin/echart']);
    //       }
    //     },
    //     err => {
    //       this.logger.log(err);
    //       // this.loginForm = this.fb.group({
    //       //   password: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(8), Validators.pattern(/^\S{1,8}$/), ]],
    //       // });
    //       // this.ngOnInit(); //5.0 to 6.0 bug:  clear input will cause when input again not trigger hasError Class

    //       // tslint:disable-next-line:no-string-literal
    //       this.errorMsg = err['error'];
    //       this.logger.log('Something went wrong!');
    //       this.confirmServ.error({
    //         nzTitle: 'Log in error!',
    //         nzContent: this.errorMsg
    //       });
    //       this._loading = false;
    //     }
    //   );

    console.log('response  ---------->>>>>>>');

    return;
  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      username: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(20), Validators.pattern(this.usernameReg)]],
      password: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(8), Validators.pattern(this.passwordReg),]],
      remember: [false],

    });

  }


  gotoRegister() { // 获取用户信息
    this.router.navigate(['/register']);
  }

  gotoForgetPassword() { // 获取用户信息
    this.router.navigate(['/forget-password']);
  }


}
