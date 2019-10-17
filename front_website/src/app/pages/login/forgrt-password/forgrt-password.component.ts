import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, } from '@angular/forms';

import { Md5 } from 'ts-md5/dist/md5';

import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NzModalService } from 'ng-zorro-antd';


@Component({
  selector: 'app-forgrt-password',
  templateUrl: './forgrt-password.component.html',
  styleUrls: ['./forgrt-password.component.less'],
})

export class ForgetPasswordComponent implements OnInit {

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
    private confirmServ: NzModalService,
    private router: Router,
  ) {

  }

  async onConfirm() {
    const email = this.loginForm.controls.email.value;
    if (this.loginForm.invalid) {
      return;
    }

    console.log('response  ---------->>>>>>>');

    return;
  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

  }

  gotoRegister() { // 获取用户信息
    this.router.navigate(['/register']);
  }

  gotoLogin() { // 获取用户信息
    this.router.navigate(['/login']);
  }



}
