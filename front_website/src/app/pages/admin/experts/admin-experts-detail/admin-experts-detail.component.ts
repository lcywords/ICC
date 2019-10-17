import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { NzModalRef, NzModalService, NzMessageService, NzTreeModule } from 'ng-zorro-antd';
import { AuthService } from 'src/app/share_module/auth_net_module/auth/auth.service';

@Component({
  selector: 'app-admin-experts-detail',
  templateUrl: './admin-experts-detail.component.html',
  styleUrls: ['./admin-experts-detail.component.less', '../../admin-user/admin-user-detail/admin-user-detail.component.less']
})
export class AdminExpertsDetailComponent implements OnInit {
  public isShareData = false;
  public institution_manager = '';
  public data = {
    created_time: '',
    last_mod_time: '',
    user_name: '',
    _id: '',
    user_sex: '',
    user_type: '',
    user_authority: '',
    user_key_code: '',
    institution_id: '',
    user_mobile: '',
    user_product_list: {}
  };
  public dataKeys = [];

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private message: NzMessageService,
    private modalService: NzModalService
  ) {
  }

  params = {
    user_id: this.route.snapshot.paramMap.get('user_id'),
  };


  ngOnInit() {
    const id: string = this.route.snapshot.paramMap.get('id');
    this.getUserDetail(id);
  }

  getUserDetail(id: string) {
    this.authService.getUserDetail(id).subscribe(res => {
      this.data.created_time = res['created_time'];
      this.data.last_mod_time = res['last_mod_time'];
      this.data._id = res['_id'];
      this.data.user_name = res['user_name'];
      this.data.user_sex = res['user_sex'];
      this.data.user_type = res['user_type'];
      this.data.user_authority = res['user_authority'];
      this.data.institution_id = res['institution_id'];
      this.data.user_key_code = res['user_key_code'];
      this.data.user_mobile = res['user_mobile'];
      if (this.data.created_time.length > 10) {
        this.data.created_time = this.data.created_time.substr(0, 10);
      }
      if (this.data.last_mod_time.length > 10) {
        this.data.last_mod_time = this.data.last_mod_time.substr(0, 10);
      }
      this.data.user_product_list = res['user_product_list'];
      this.dataKeys = Object.getOwnPropertyNames(res['user_product_list']);
    });
  }

  updateProductData() {
    this.authService.updateProductData(this.data._id, this.data.user_product_list).subscribe(res => {
      this.message.success('update product success!');
    });
  }

  changeUserPassword = () => {
    // this.authService.changeUserPassword(this.data._id).subscribe(res => {
    //   this.modalService.success({
    //     nzTitle: 'change user password success!',
    //     nzContent: 'userID: ' + res['user_id'] + ' | ' + 'password: ' + res['password']
    //   });
    // });
  }

  changeUserNumber = () => {
    const values = {
      user_mobile: this.data.user_mobile
    };
    const mobileReg = new RegExp(/^(\+?0?86\-?)?1[345789]\d{9}$/);
    const mobile = this.data.user_mobile.toString();
    if (mobile.match(mobileReg)) {
      this.authService.changeUserNumber(this.data._id, values).subscribe(res => {
        this.message.success('change user mobile success!');
      });
    } else {
      this.modalService.warning({
        nzTitle: '错误提示',
        nzContent: '手机号格式不正确!'
      });
    }
  }
}
