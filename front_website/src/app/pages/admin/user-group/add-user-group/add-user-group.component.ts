import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { NzModalRef, NzModalService, NzMessageService, NzTreeModule } from 'ng-zorro-antd';
import { Display } from 'src/app/service/multi/display';
import { AuthService } from 'src/app/share_module/auth_net_module/auth/auth.service';

@Component({
  selector: 'app-add-user-group',
  templateUrl: './add-user-group.component.html',
  styleUrls: ['./add-user-group.component.less']
})
export class AddUserGroupComponent implements OnInit {

  institutionList = [];
  userList = [];
  validateForm: FormGroup;
  // 产品选项
  nodes = {};
  // 产品ID
  indexs = {};
  // 产品的名称
  dataKeys = [];
  userMemberMap = {};
  institutionMember = {};
  institutionMemberName = {};
  institutionMemberList = [];
  private passwordReg = /^\S{1,20}$/;

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
      groupName: [null, [Validators.required]],
      managerId: [null, [Validators.required]],
      institutionId: [null, [Validators.required]]
    });
  }


  ngOnInit() {
    // this.getInstitutionList();
    const display = new Display();
    this.nodes = display.userAuthorityMap;
    this.indexs = display.userAuthorityIndexs;
    this.dataKeys = Object.getOwnPropertyNames(display.userAuthorityIndexs);
    this.getUserList();
    this.getInstitutionList();
  }
  getUserList() {
    this.authService.getUserList().subscribe(res => {
      this.userList = res as Array<any>;
      this.userList.forEach((item) => {
        this.userMemberMap[item._id] = false;
        let key = item.institution_id;
        if (item.institution_id === '') {
          key = 'other';
        }
        if (!this.institutionMember[key]) {
          this.institutionMember[key] = [];
          this.institutionMemberName[key] = item.institution_name;
        }
        this.institutionMember[key].push(item);
      });
      this.institutionMemberList = Object.getOwnPropertyNames(this.institutionMember);
    });
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

    const authorityList = [];
    const userIdList = [];

    this.userList.forEach((item) => {
      if (this.userMemberMap[item['_id']]) {
        userIdList.push(item['_id']);
      }
    });

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
      name: this.validateForm.controls.groupName.value,
      manager: this.validateForm.controls.managerId.value,
      authority: authorityList,
      institution_id: this.validateForm.controls.institutionId.value,
      user_id_list: userIdList
    };
    this.authService.AddUserGroup(data).subscribe(res => {
      this.message.create('success', '添加用户成功,返回用户列表页面');
      this.router.navigate([`admin/user-group-list`]);
    });
  }

  warning(): void {
    this.nzModel.warning({
      nzTitle: '信息填写不完整',
      nzContent: '必要信息：用户名，机构。'
    });
  }


}
