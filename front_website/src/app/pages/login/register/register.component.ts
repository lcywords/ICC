import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, } from '@angular/forms';

import { Md5 } from 'ts-md5/dist/md5';

import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NzModalService } from 'ng-zorro-antd';
import { UserService } from 'src/app/middleware/api_service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.less'],
})

export class RegisterComponent implements OnInit {

  public registerForm: FormGroup;

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
    private userService: UserService
  ) {
    this.registerForm = this.fb.group({
      username: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(20), Validators.pattern(this.usernameReg)]],
      password: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(8), Validators.pattern(this.passwordReg)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(8), Validators.pattern(this.passwordReg)]],
      email: ['', [Validators.required, Validators.email]],
      remember: [false],
    });

  }

  async onLogin() {
    // const username = this.registerForm.controls.username.value;
    // const password = this.registerForm.controls.password.value;
    // const confirmPassword = this.registerForm.controls.confirmPassword.value;
    // const email = this.registerForm.controls.email.value;

    // if (this.registerForm.invalid || password !== confirmPassword || !this.registerForm.controls.remember.value) {
    //   return;
    // }


    return;
  }



  ngOnInit() {

  }

  gotoLogin() { // 获取用户信息
    // this.router.navigate(['/login']);
    this.userService.deleteUser('dshfaiusdh').subscribe(data => {
      console.log(data);
    }, data => {
      console.log(data);
    }, () => {
      console.log('data');
    });
  }


}
