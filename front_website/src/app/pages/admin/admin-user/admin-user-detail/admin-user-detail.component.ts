import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { NzModalRef, NzModalService, NzMessageService, NzTreeModule } from 'ng-zorro-antd';
import { Display } from 'src/app/service/multi/display';
import { AuthService } from 'src/app/share_module/auth_net_module/auth/auth.service';

@Component({
  selector: 'app-admin-user-detail',
  templateUrl: './admin-user-detail.component.html',
  styleUrls: ['./admin-user-detail.component.less']
})
export class AdminUserDetailComponent implements OnInit {
  public isShareData = false;
  public userInfo;

  nodes = {};
  indexs = {};
  userProductMap = {};
  dataKeys = [];
  isShowInstitutionModal = false;
  institutionForm: FormGroup;
  displayUserProductMap = {};

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private message: NzMessageService,
    private router: Router,
    private nzMs: NzMessageService,
    private modalService: NzModalService
  ) {
    this.institutionForm = this.fb.group({
      newPassword: [null, [Validators.required]]
    });
  }

  params = {
    user_id: this.route.snapshot.paramMap.get('user_id'),
  };


  ngOnInit() {
    const display = new Display();
    this.nodes = display.userAuthorityMap;
    this.indexs = display.userAuthorityIndexs;
    this.userProductMap = display.userProductMap;
    this.displayUserProductMap = display.displayUserProductMap;
    this.dataKeys = Object.getOwnPropertyNames(this.userProductMap);
    const id: string = this.route.snapshot.paramMap.get('id');
    this.getUserDetail(id);
  }

  getUserDetail(id: string) {
    this.authService.getUserDetail(id).subscribe(res => {
      this.userInfo = res;
      if (this.userInfo.created_time.length > 10) {
        this.userInfo.created_time = this.userInfo.created_time.substr(0, 10);
      }
      if (this.userInfo.last_mod_time.length > 10) {
        this.userInfo.last_mod_time = this.userInfo.last_mod_time.substr(0, 10);
      }
      this.userInfo.user_product_list = res['user_product_list'] as Array<string>;
      this.userInfo.user_product_list.forEach(element => {
        this.userProductMap[element] = true;
      });
      this.userInfo.user_authority_list = res['user_authority_list'] as Array<string>;
      for (const key of Object.keys(this.indexs)) {
        if (this.userInfo.user_authority_list) {
          for (const iterator of this.userInfo.user_authority_list) {
            if (this.indexs[key] === Number(iterator.dsl_class_type)) {
              this.nodes[key] = [];
              for (const iterator2 of Object.keys(iterator.dsl_class_data)) {
                this.nodes[key].push({
                  key: iterator2,
                  value: iterator.dsl_class_data[iterator2]
                });
              }
            }
          }
        }
      }
    });
  }

  updateProductData() {
    const userProductList = [];
    const userAuthorityList = [];
    this.dataKeys.forEach((item) => {
      if (this.userProductMap[item]) {
        userProductList.push(item);
      }
      if (this.nodes[item] && this.userProductMap[item]) {
        const userAuthority = {
          dsl_class_type: this.indexs[item],
          dsl_class_data: this.nodes[item]
        };
        userAuthorityList.push(userAuthority);
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
    const data = {
      _id: this.userInfo._id,
      // user_name: this.validateForm.controls.userName.value,
      // user_sex: sex,
      // user_type: this.validateForm.controls.userType.value,
      institution_id: this.userInfo.institution_id,
      // description: this.validateForm.controls.description.value,
      // institution_name: institutionName,
      user_authority_list: authorityList,
      // user_birth_date: birthday,
      user_product_list: userProductList,
      // user_mobile: this.validateForm.controls.userMobile.value
    };
    this.authService.EditUser(data).subscribe(res => {
      this.message.create('success', '更新用户信息成功,返回用户列表页面');
      this.router.navigate([`admin/user`]);
    });
  }

  changeUserPassword = () => {
    this.isShowInstitutionModal = true;
  }

  institutionCancelModal() {
    this.isShowInstitutionModal = false;
    this.institutionForm.controls.newPassword.setValue(null);
  }

  institutionOkModal() {
    const controls = this.institutionForm.controls;
    // tslint:disable-next-line:forin
    for (const i in this.institutionForm.controls) {
      this.institutionForm.controls[i].markAsDirty();
      this.institutionForm.controls[i].updateValueAndValidity();
    }

    if (this.institutionForm.invalid) {
      return;
    }

    this.authService.changeUserPassword(this.userInfo._id, this.institutionForm.controls.newPassword.value).subscribe(
      res => {
        this.nzMs.success('修改密码成功!');
        this.isShowInstitutionModal = false;
      },
      err => {
        this.nzMs.error('修改密码失败!');
        this.isShowInstitutionModal = false;
      }
    );

  }

}
