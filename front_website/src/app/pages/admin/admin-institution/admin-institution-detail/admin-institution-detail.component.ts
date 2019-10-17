import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { NzModalRef, NzModalService, NzMessageService, NzTreeModule, NzFormatEmitEvent } from 'ng-zorro-antd';
import { AuthService } from 'src/app/share_module/auth_net_module/auth/auth.service';

@Component({
  selector: 'app-admin-institution-detail',
  templateUrl: './admin-institution-detail.component.html',
  styleUrls: ['./admin-institution-detail.component.less']
})
export class AdminInstitutionDetailComponent implements OnInit {

  public institutionManager;
  userList = [];
  public isDeleteInstitution: boolean;
  isShowModal = false;
  isShowInstitutionModal = false;
  currentId: string;
  parrentId: string;
  public isSpinning: boolean;
  nodes = [

  ];

  public institution = {
    "institution_id": '',
    "institution_name": '',
    "institution_address": '',
    "manager": '',
    'parent_id_list': []
  };
  public managerList = [
    {
      id: '',
      name: ''
    }
  ];
  public userManagerList = [];

  public institutionChildrenList = [];
  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private nzMs: NzMessageService,
    private route: ActivatedRoute,
    private nzTree: NzTreeModule,
    private nzModel: NzModalService
  ) {

  }
  validateForm: FormGroup;
  institutionForm: FormGroup;
  userForm = {
    username: '',
    user_id: '',
  };

  params = {
    user_id: this.route.snapshot.paramMap.get('user_id'),
  };


  ngOnInit() {
    const id: string = this.route.snapshot.paramMap.get('id');
    this.validateForm = this.fb.group({
      institutionName: [null, [Validators.required]],
      institutionAdress: [null, [Validators.required]],
      // managerId: [null, [Validators.required]]
    });
    this.institutionForm = this.fb.group({
      institutionId: [null, [Validators.required]],
      institutionName: [null, [Validators.required]],
      institutionAdress: [null, [Validators.required]],
      managerId: [null, [Validators.required]],
      parentId: [null]
    });
    this.getInstitutionDetail(id);
  }

  getUserList() {
    this.authService.getUserList().subscribe(res => {
      this.userList = res as Array<any>;
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

  // 添加子机构
  addInstitution() {
    // tslint:disable-next-line:forin
    for (const iterator in this.validateForm.controls) {
      this.validateForm.controls[iterator].clearValidators();
      this.validateForm.controls[iterator].updateValueAndValidity();
      this.validateForm.controls[iterator].setValue(null);
      this.validateForm.controls[iterator].setValidators(Validators.required);
    }
    this.isShowModal = true;
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

    if (this.validateForm.invalid) {
      return;
    }
    const institution = {
      institution_address: controls.institutionAdress.value,
      institution_name: controls.institutionName.value,
      parent_id: this.currentId,
      manager: ''
    };
    const institutionList = [institution];
    const reqData = {
      institution_list: institutionList
    };

    this.authService.addInstitution(reqData).subscribe(
      res => {
        this.getInstitutionDetail(this.currentId);
        this.isShowModal = false;
      },
      err => {
        alert('添加机构失败');
      },
      () => {
        this.getInstitutionDetail(this.currentId);
        this.isShowModal = false;
      });

  }

  editOtherInstitution(data) {
    if (!data.institution_id) {
      this.nzModel.warning({
        nzTitle: '机构还没有提交，不能编辑！',
        nzContent: ''
      });
    } else {
      this.getInstitutionDetail(data.institution_id);
    }
  }

  nzEvent(event: NzFormatEmitEvent): void {
    this.getInstitutionDetail(event.keys[0]);
  }

  async getInstitutionDetail(institutionId: string) {
    this.currentId = institutionId;
    this.isSpinning = true;
    this.authService.getInstitutionList('').subscribe(
      res => {
        const institutionList = res as Array<any>;
        this.composeTree(institutionList);
        for (const item of institutionList) {
          if (item['institution_id'] === institutionId) {
            this.institution = item;
            this.institutionManager = res['manager'];
            if (item['parent_id_list']) {
              this.parrentId = item['parent_id_list'][item['parent_id_list'].length - 1];
            }
            break;
          }
        }
        this.isSpinning = false;
      }
    );
    await this.authService.getInstitutionList(institutionId).subscribe(
      res => {
        this.institutionChildrenList = res as Array<any>;
        this.isDeleteInstitution = false;
        this.isSpinning = false;
      }
    );
    this.getUserList();
  }

  showDeleteConfirm() {
    this.nzModel.confirm({
      nzTitle: '是否确认删除机构及其子机构?',
      nzContent: '',
      nzOkText: '确认',
      nzOkType: 'danger',
      nzOnOk: () => {
        this.deleteInstitution();
      },
      nzCancelText: '取消',
      nzOnCancel: () => {
      }
    });
  }

  selectDeleteInstitution() {
    this.isDeleteInstitution = !this.isDeleteInstitution;
  }

  deleteInstitution() {
    this.institution['institution_manager'] = this.institutionManager;
    const deleteIdList = [];
    this.institutionChildrenList.forEach((item) => {
      if (item['is_delete']) {
        deleteIdList.push(item['institution_id']);
      }
    });
    if (deleteIdList.length === 0) {
      this.nzModel.warning({
        nzTitle: '请选择机构！',
        nzContent: ''
      });
    }
    this.authService.deleteInstitution(deleteIdList).subscribe(
      res => {
        this.getInstitutionDetail(this.institution['institution_id']);
      },
      err => {
        alert('删除机构失败');
        console.log(err);
      }
    );
  }

  backToParent() {
    if (this.parrentId) {
      const id: string = this.parrentId;
      this.getInstitutionDetail(id);
    } else {
      this.router.navigate(['/admin/institution']);
    }
  }

  editInstitution(data) {
    const userList = [];
    this.userList.forEach((item) => {
      if (item.institution_id === data.institution_id) {
        userList.push(item);
      }
    });
    this.userManagerList = userList;
    if (!data.institution_id) {
      this.nzModel.warning({
        nzTitle: '机构还没有提交，不能编辑！',
        nzContent: ''
      });
    } else {
      let managerId = null;
      this.userList.forEach((item) => {
        if (item._id === data.manager) {
          managerId = data.manager;
        }
      });
      this.isShowInstitutionModal = true;
      this.institutionForm.controls.institutionId.setValue(data.institution_id);
      this.institutionForm.controls.institutionAdress.setValue(data.institution_address);
      this.institutionForm.controls.institutionName.setValue(data.institution_name);
      this.institutionForm.controls.managerId.setValue(managerId);
      this.institutionForm.controls.parentId.setValue(data.parent_id);
    }
  }

  institutionCancelModal() {
    this.isShowInstitutionModal = false;
    this.institutionForm.controls.institutionId.setValue(null);
    this.institutionForm.controls.institutionAdress.setValue(null);
    this.institutionForm.controls.institutionName.setValue(null);
    this.institutionForm.controls.managerId.setValue(null);
    this.institutionForm.controls.parentId.setValue(null);
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
    const institution = {
      institution_id: controls.institutionId.value,
      institution_address: controls.institutionAdress.value,
      institution_name: controls.institutionName.value,
      parent_id: this.currentId,
      manager: controls.managerId.value
    };
    const reqData = institution;

    this.authService.editInstitution(reqData).subscribe(
      res => {
        this.getInstitutionDetail(this.currentId);
        this.isShowInstitutionModal = false;
      },
      err => {
        alert('编辑机构失败');
      },
      () => {
        this.getInstitutionDetail(this.currentId);
        this.isShowInstitutionModal = false;
      });

  }

  showDeleteConfirm2() {
    this.nzModel.confirm({
      nzTitle: '是否确认删除 [ ' + this.institution['institution_name'] + ' ] 及其子机构?',
      nzContent: '',
      nzOkText: '确认',
      nzOkType: 'danger',
      nzOnOk: () => {
        this.deleteHandle();
      },
      nzCancelText: '取消',
      nzOnCancel: () => {
      }
    });
  }

  //  删除用户
  deleteHandle() {
    const deleteIdList = [this.currentId];
    this.authService.deleteInstitution(deleteIdList).subscribe(
      res => {
        this.backToParent();
      },
      err => {
        alert('删除机构失败');
        console.log(err);
      }
    );
  }

}
