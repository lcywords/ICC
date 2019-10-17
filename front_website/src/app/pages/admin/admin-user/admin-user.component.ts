import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { Display } from 'src/app/service/multi/display';
import { AuthService } from 'src/app/share_module/auth_net_module/auth/auth.service';



@Component({
  selector: 'app-admin-user',
  templateUrl: './admin-user.component.html',
  styleUrls: ['../admin.component.less', './admin-user.component.less']
})
export class AdminUserComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private nzMs: NzMessageService,
    private nzModel: NzModalService
  ) {

  }
  dataList = [];
  isShowModal: boolean;
  institutionList = [];
  validateForm: FormGroup;
  userTypeList = [];


  ngOnInit() {
    const display = new Display();
    this.userTypeList = display.userTypeList;
    this.getList();
    this.validateForm = this.fb.group({
      institutionId: [null, [Validators.required]],
      userSex: [null, [Validators.required]],
      userName: [null, [Validators.required]],
      userType: [null, [Validators.required]]
    });
  }
  getList() {
    this.authService.getUserList().subscribe(res => {
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

  addUser() {
    this.router.navigate([`admin/add-user`]);
    // tslint:disable-next-line:forin
    // for (const iterator in this.validateForm.controls) {
    //   this.validateForm.controls[iterator].clearValidators();
    //   this.validateForm.controls[iterator].updateValueAndValidity();
    //   this.validateForm.controls[iterator].setValue(null);
    //   this.validateForm.controls[iterator].setValidators(Validators.required);
    // }
    // this.getInstitutionList();
    // this.isShowModal = true;
  }

  update(data) {
    this.router.navigate([`admin/user-details/${data._id}`]);
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
    this.addUserInfo();
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

  addUserInfo() { // 获取用户信息
    const sex = this.validateForm.controls.userSex.value === '2' ? '' : this.validateForm.controls.userSex.value;
    const data = {
      user_name: this.validateForm.controls.userName.value,
      user_sex: sex,
      user_type: this.validateForm.controls.userType.value,
      institution_id: this.validateForm.controls.institutionId.value,
    };
    this.authService.addNewUser(data).subscribe(res => {
      this.isShowModal = false;
      this.getList();
    });
  }

  warning(): void {
    let errorMsg = '';
    if (this.validateForm.controls.userName.invalid) {
      errorMsg = '用户名填写不正确!';
    } else if (this.validateForm.controls.userSex.invalid) {
      errorMsg = '用户性别填写不正确!';
    } else if (this.validateForm.controls.userType.invalid) {
      errorMsg = '用户类型填写不正确!';
    } else if (this.validateForm.controls.institutionId.invalid) {
      errorMsg = '机构填写不正确!';
    }
    this.nzModel.warning({
      nzTitle: '错误提示',
      nzContent: errorMsg
    });
  }

}
