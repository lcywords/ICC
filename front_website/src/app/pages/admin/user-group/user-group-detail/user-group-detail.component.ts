import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { NzModalRef, NzModalService, NzMessageService, NzTreeModule, NzFormatEmitEvent } from 'ng-zorro-antd';
import { Display } from 'src/app/service/multi/display';
import { AuthService } from 'src/app/share_module/auth_net_module/auth/auth.service';

@Component({
  selector: 'app-user-group-detail',
  templateUrl: './user-group-detail.component.html',
  styleUrls: ['./user-group-detail.component.less']
})
export class UserGroupDetailComponent implements OnInit {


  dataList = [];
  userList = [];
  validateForm: FormGroup;
  groupId: string;
  nodes = {};
  indexs = {};
  dataKeys = [];
  userMemberMap = {};
  institutionMember = {};
  institutionMemberName = {};
  institutionMemberList = [];

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
    });
  }


  ngOnInit() {
    const display = new Display();
    this.nodes = display.userAuthorityMap;
    this.indexs = display.userAuthorityIndexs;
    this.dataKeys = Object.getOwnPropertyNames(display.userAuthorityIndexs);
    const id: string = this.route.snapshot.paramMap.get('id');
    this.groupId = id;
    this.getUserList(id);
  }
  getUserList(id: string) {
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
      this.getInstitutionList(id);
    });
  }

  getInstitutionList(id: string) {
    this.authService.GetUserGroupList().subscribe(res => {
      this.dataList = res as Array<any>;
      this.dataList.forEach(element => {
        if (element['_id'] === id) {
          this.validateForm.controls.groupName.setValue(element['name']);
          this.validateForm.controls.managerId.setValue(element['manager']);
          const authority = element['authority'];
          for (const key of Object.keys(this.indexs)) {
            for (const iterator of authority) {
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
          const userList = element['user_id_list'];
          userList.forEach(item => {
            this.userMemberMap[item] = true;
          });
          this.institutionMemberList.forEach((key) => {
            this.institutionMember[key].sort((a, b) => {
              if (userList.indexOf(a._id) >= 0) {
                return -1;
              } else {
                return 1;
              }
            });
          });
        }
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
      _id: this.groupId,
      name: this.validateForm.controls.groupName.value,
      manager: this.validateForm.controls.managerId.value,
      authority: authorityList,
      user_id_list: userIdList
    };
    this.authService.EditUserGroup(data).subscribe(res => {
      this.message.create('success', '修改用户组信息成功,返回用户组列表页面');
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

