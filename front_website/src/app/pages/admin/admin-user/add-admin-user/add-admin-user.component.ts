import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {
  NzModalService, NzMessageService, NzTreeModule,
  NzTreeComponent, NzTreeNodeOptions, NzFormatEmitEvent
} from 'ng-zorro-antd';
import { UUID } from 'angular2-uuid';
import { Display } from 'src/app/service/multi/display';
import { Md5 } from 'ts-md5';
import { AuthService } from 'src/app/share_module/auth_net_module/auth/auth.service';

@Component({
  selector: 'app-add-admin-user',
  templateUrl: './add-admin-user.component.html',
  styleUrls: ['./add-admin-user.component.less']
})
export class AddAdminUserComponent implements OnInit {

  institutionList = [];
  validateForm: FormGroup;
  nodes = {};
  indexs = {};
  userProductMap = {};
  dataKeys = [];
  userTypeList = [];
  // tslint:disable-next-line:max-line-length
  private phoneNumber = /(^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$)|(^((\(\d{3}\))|(\d{3}\-))?(1[3578]\d{9})$)|(^(400)-(\d{3})-(\d{4})(.)(\d{1,4})$)|(^(400)-(\d{3})-(\d{4}$))/;
  private passwordReg = /^\S{1,20}$/;
  displayUserProductMap = {};

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private nzMs: NzMessageService,
    private route: ActivatedRoute,
    private nzTree: NzTreeModule,
    private message: NzMessageService,
    private nzModel: NzModalService
  ) {
    this.validateForm = this.fb.group({
      institutionId: [null, [Validators.required]],
      userSex: [null, [Validators.required]],
      userName: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      userId: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      userType: [null, [Validators.required]],
      year: [''],
      month: [''],
      day: [''],
      userMobile: ['', [Validators.pattern(this.phoneNumber)]],
      userPassword: [null, [Validators.pattern(this.passwordReg)]],
      description: ['']
    });
  }


  ngOnInit() {
    const display = new Display();
    this.nodes = display.userAuthorityMap;
    this.indexs = display.userAuthorityIndexs;
    this.userProductMap = display.userProductMap;
    this.displayUserProductMap = display.displayUserProductMap;
    this.dataKeys = Object.getOwnPropertyNames(this.userProductMap);
    this.userTypeList = display.userTypeList;
    this.getInstitutionList();
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

  handleOkModal() {
    console.log(this.nodes);
    console.log('uuid', UUID.UUID());
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

  addUserInfo() { // 获取用户信息
    const sex = this.validateForm.controls.userSex.value === '2' ? '' : this.validateForm.controls.userSex.value;
    let institutionName;
    this.institutionList.forEach((item) => {
      if (item['institution_id'] === this.validateForm.controls.institutionId.value) {
        institutionName = item['institution_name'];
      }
    });

    const birthday = this.validateForm.controls.year.value + '-' + this.validateForm.controls.month.value + '-'
      + this.validateForm.controls.day.value;
    const userProductList = [];
    // const userAuthorityList = [];
    this.dataKeys.forEach((item) => {
      if (this.userProductMap[item]) {
        userProductList.push(item);
      }
    });
    const authorityList = [];

    const authorityKeys = Object.getOwnPropertyNames(this.indexs);
    for (const iterator of authorityKeys) {
      if (this.nodes[iterator]) {
        // tslint:disable-next-line:prefer-const
        let objectItem = {
          dsl_class_type: 0,
          dsl_class_data: {
          }
        };
        objectItem.dsl_class_type = this.indexs[iterator];
        for (const nodeChild of this.nodes[iterator]) {
          objectItem.dsl_class_data[nodeChild.key] = nodeChild.value;
        }
        authorityList.push(objectItem);
      }
    }

    const uuid = UUID.UUID();
    const data = {
      _id: this.validateForm.controls.userId.value,
      user_name: this.validateForm.controls.userName.value,
      user_sex: sex,
      user_type: this.validateForm.controls.userType.value,
      institution_id: this.validateForm.controls.institutionId.value,
      description: this.validateForm.controls.description.value ? this.validateForm.controls.description.value : '',
      institution_name: institutionName,
      user_authority_list: authorityList,
      user_birth_date: birthday,
      user_product_list: userProductList,
      user_password: String(Md5.hashStr(this.validateForm.controls.userPassword.value)),
      user_mobile: this.validateForm.controls.userMobile.value
    };
    this.authService.addNewUser(data).subscribe(res => {
      this.message.create('success', '添加用户成功,返回用户列表页面');
      this.router.navigate([`admin/user`]);
    }, err => {
      this.message.create('error', '用户已存在! 请更换用户id!');
    });
  }

  warning(): void {
    this.nzModel.warning({
      nzTitle: '信息填写不完整',
      nzContent: '必要信息：用户名，机构。'
    });
  }


}
