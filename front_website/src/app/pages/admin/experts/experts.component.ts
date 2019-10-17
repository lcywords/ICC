import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, } from '@angular/forms';
import { Router } from '@angular/router';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { Md5 } from 'ts-md5';
import { Display } from 'src/app/service/multi/display';
import { AuthService } from 'src/app/share_module/auth_net_module/auth/auth.service';

const mobileReg = /^(\+?0?86\-?)?1[345789]\d{9}$/;

@Component({
  selector: 'app-experts',
  templateUrl: './experts.component.html',
  styleUrls: ['../admin.component.less'],
})

export class ExpertsComponent implements OnInit {

  dataList = [];
  isShowModal: boolean;
  institutionList = [];
  validateForm: FormGroup;
  userTypeList = [];
  errorMsg = '请输入手机号!';
  private passwordReg = /^\S{1,20}$/;

  constructor(
    private authService: AuthService,
    private router: Router,
    private nzModel: NzModalService,
    private fb: FormBuilder,
    private nzMs: NzMessageService
  ) {

  }

  // 获取用户信息
  getList() {
    this.authService.getExpertsList().subscribe(res => {
      this.dataList = res as Array<any>;
      this.dataList.sort((a, b) => {
        if (!a.created_time) {
          return -1;
        } else if (!b.created_time) {
          return 1;
        }
        try {
          const r1 = a.created_time.substring(0, 19).replace(/[^0-9]/ig, '');
          const r2 = b.created_time.substring(0, 19).replace(/[^0-9]/ig, '');
          return Number(r2) - Number(r1);
        } catch (e) {
          return -1;
        }
      });
    });
  }

  ngOnInit() {
    const display = new Display();
    this.userTypeList = display.userTypeList;
    this.getList();
    this.setForm();
  }

  setForm() {
    this.validateForm = this.fb.group({
      institutionName: [null, [Validators.required]],
      userSex: [null, [Validators.required]],
      userName: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      userType: [null, [Validators.required]],
      userPassword: [null, [Validators.pattern(this.passwordReg)]],
      userMobile: [null, [Validators.required, Validators.maxLength(11), Validators.minLength(11), Validators.pattern(mobileReg)]]
    });
  }

  addExpert() {
    // tslint:disable-next-line:forin
    for (const iterator in this.validateForm.controls) {
      this.validateForm.controls[iterator].clearValidators();
      this.validateForm.controls[iterator].updateValueAndValidity();
      this.validateForm.controls[iterator].setValue(null);
      this.validateForm.controls[iterator].setValidators(Validators.required);
    }
    this.validateForm.controls.userMobile.setValidators([Validators.required,
    Validators.maxLength(11), Validators.minLength(11), Validators.pattern(mobileReg)]);
    this.isShowModal = true;
  }

  update(data) {
    this.router.navigate([`admin/user-details/${data._id}`]);
  }


  handleCancelModal() {
    this.isShowModal = false;
  }

  handleOkModal() {
    // tslint:disable-next-line:forin
    for (const iterator in this.validateForm.controls) {
      this.validateForm.controls[iterator].markAsDirty();
      this.validateForm.controls[iterator].updateValueAndValidity();
    }
    if (this.validateForm.invalid) {
      return;
    }
    this.addNewExpert();
  }

  getInstitutionList() {
    this.authService.getInstitutionList().subscribe(res => {
      let tempList = [];
      tempList = res as Array<any>;
      tempList.forEach((item) => {
        this.institutionList.push(item);
      });

    });
  }

  //  删除用户
  deleteHandle(row) {
    this.authService.DeleteUser(row._id).subscribe(res => {
      this.nzMs.success('删除成功!');
      this.getList();
    });
  }
  showDeleteConfirm(row) {
    this.nzModel.confirm({
      nzTitle: '是否确认删除用户?',
      nzContent: '',
      nzOkText: '确认',
      nzOkType: 'danger',
      nzOnOk: () => {
        this.deleteHandle(row);
      },
      nzCancelText: '取消',
      nzOnCancel: () => {

      }
    });
  }

  addNewExpert() { // 获取用户信息
    const sex = this.validateForm.controls.userSex.value === '2' ? '' : this.validateForm.controls.userSex.value;
    const data = {
      user_name: this.validateForm.controls.userName.value,
      user_sex: sex,
      user_type: this.validateForm.controls.userType.value,
      institution_name: this.validateForm.controls.institutionName.value,
      user_mobile: this.validateForm.controls.userMobile.value,
      user_password: this.validateForm.controls.userPassword.value
    };
    this.authService.addNewExpert(data).subscribe(res => {
      this.isShowModal = false;
      this.getList();
    });
  }

  requiredChange(e) {
    if (this.validateForm.controls.userMobile.invalid) {
      if ('maxlength' in this.validateForm.controls.userMobile.errors) {
        this.errorMsg = '手机号长度超过11位!';
      } else if ('minlength' in this.validateForm.controls.userMobile.errors) {
        this.errorMsg = '手机号长度不足11位!';
      } else if ('pattern' in this.validateForm.controls.userMobile.errors) {
        this.errorMsg = '手机号格式不正确!';
      } else {
        this.errorMsg = '手机号填写不正确!';
      }
    }
  }

  warning(): void {
    let errorMsg = '';
    if (this.validateForm.controls.userName.invalid) {
      errorMsg = '用户名填写不正确!';
    } else if (this.validateForm.controls.userMobile.invalid) {
      if (this.validateForm.controls.userMobile.errors.maxlength) {
        errorMsg = '手机号长度超过11位!';
      } else if (this.validateForm.controls.userMobile.errors.minlength) {
        errorMsg = '手机号长度不足11位!';
      } else if (this.validateForm.controls.userMobile.errors.pattern) {
        errorMsg = '手机号格式不正确!';
      } else {
        errorMsg = '手机号填写不正确!';
      }
    } else if (this.validateForm.controls.userSex.invalid) {
      errorMsg = '用户性别填写不正确!';
    } else if (this.validateForm.controls.userType.invalid) {
      errorMsg = '用户类型填写不正确!';
    } else if (this.validateForm.controls.institutionName.invalid) {
      errorMsg = '机构填写不正确!';
    }
    this.nzModel.warning({
      nzTitle: '错误提示',
      nzContent: errorMsg
    });
  }

}
