import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { NzModalRef, NzModalService, NzMessageService, NzFormatEmitEvent } from 'ng-zorro-antd';
import { AuthService } from 'src/app/share_module/auth_net_module/auth/auth.service';

@Component({
  selector: 'app-user-group-list',
  templateUrl: './user-group-list.component.html',
  styleUrls: ['./user-group-list.component.less', '../admin.component.less',]
})
export class UserGroupListComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private nzMs: NzMessageService,
    private route: ActivatedRoute,
    private nzModel: NzModalService,
  ) {
  }
  dataList = [];
  userList = [];
  userDialog = false;
  validateForm: FormGroup;

  isShowModal = false;
  modalTitle = '添加机构';
  public institutionName: string;
  public institutionAdress: string;
  isTreeDisplay: boolean;

  nodes = [];

  ngOnInit() {
    this.getList();
    this.validateForm = this.fb.group({
      institutionName: [null, [Validators.required]],
      institutionAdress: [null, [Validators.required]],
      institutionId: [null, [Validators.required]],
      managerId: [null, [Validators.required]]
    });
  }

  getList() {
    this.authService.GetUserGroupList().subscribe(res => {
      this.dataList = res as Array<any>;
    });
  }


  composeTree(list = []) {
    const data = []; // 浅拷贝不改变源数据
    list.forEach((e) => {
      let parentId = '';
      if (Array.isArray(e['parent_id_list']) && e['parent_id_list'].length !== 0) {
        parentId = e['parent_id_list'][e['parent_id_list'].length - 1];
      }
      data.push({
        title: e['institution_name'],
        key: e['institution_id'],
        parent_id: parentId,
        isLeaf: true,
        expanded: true
      });
    });
    const result = [];
    if (!Array.isArray(data)) {
      return result;
    }
    // data.forEach(item => {
    //   delete item.children;
    // });
    const map = {};
    data.forEach(item => {
      map[item.key] = item;
    });
    data.forEach(item => {
      const parent = map[item.parent_id];
      if (parent) {
        parent.isLeaf = false;
        (parent.children || (parent.children = [])).push(item);
      } else {
        result.push(item);
      }
    });
    this.nodes = result;
    return result;
  }

  create() {
    this.router.navigate([`admin/edit/create`]);
  }

  update(data) {
    this.router.navigate([`admin/user-group-details/${data._id}`]);
  }

  close() {
    this.userDialog = false;
  }
  typeChange(event) {
    console.log(event, 1111);
  }
  productChange(event) {
    console.log(event, 222);
  }
  //  删除用户
  deleteHandle(row) {
    this.authService.DeleteUserGroup(row._id).subscribe(
      res => {
        this.getList();
      },
      err => {
        alert('删除机构失败');
        console.log(err);
      }
    );
  }

  showDeleteConfirm(row) {
    this.nzModel.confirm({
      nzTitle: '是否确认删除机构及其子机构?',
      nzContent: '',
      nzOkText: '确认',
      nzOkType: 'danger',
      nzOnOk: () => {
        this.deleteHandle(row);
      },
      nzCancelText: '取消',
      nzOnCancel: () => {
        this.userDialog = false;
      }
    });
  }

  async addUserGroup() {
    this.router.navigate(['/admin/add-user-group']);
  }
  handleCancelModal() {
    this.isShowModal = false;
  }
  handleOkModal() {
    const controls = this.validateForm.controls;
    // tslint:disable-next-line:forin
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    console.log('---cancel===>', this.institutionName, this.institutionAdress);
    if (this.validateForm.invalid) {
      return;
    }
    const institution = {
      institution_id: controls.institutionId.value,
      institution_address: controls.institutionAdress.value,
      institution_name: controls.institutionName.value,
      parent_id: '',
      manager: controls.managerId.value
    };
    const institutionList = [institution];
    const reqData = {
      institution_list: institutionList
    };

    this.authService.AddUserGroup(reqData).subscribe(
      res => {
        this.getList();
        this.isShowModal = false;
      },
      err => {
        this.nzModel.warning({
          nzTitle: '错误提示',
          nzContent: '该机构ID已存在'
        });
      },
      () => {
        this.getList();
        this.isShowModal = false;
      });

  }

  getUserList() {
    this.authService.getUserList().subscribe(res => {
      this.userList = res as Array<any>;
    });
  }


  nzEvent(event: NzFormatEmitEvent): void {
    this.router.navigate([`admin/user-group-detail/${event.keys[0]}`]);
  }

  changeDisplayWay() {
    this.isTreeDisplay = !this.isTreeDisplay;
  }

}
