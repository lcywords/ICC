import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { NzModalRef, NzModalService, NzMessageService, NzTreeModule } from 'ng-zorro-antd';
import { Display } from 'src/app/service/multi/display';
import { AuthService } from 'src/app/share_module/auth_net_module/auth/auth.service';

@Component({
  selector: 'app-admin-institution-person',
  templateUrl: './admin-institution-person.component.html',
  styleUrls: ['../../admin.component.less']
})
export class AdminInstitutionPersonComponent implements OnInit {

  userList = [];
  patientList = [];

  isShowModal: boolean;
  institutionId: string;
  isConfirmLoading: boolean;
  validateForm: FormGroup;
  userTypeList = [];


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

  ngOnInit() {
    const display = new Display();
    this.userTypeList = display.userTypeList;
    const id: string = this.route.snapshot.paramMap.get('id');
    this.institutionId = id;
    this.getInstitutionUsers(id);
    this.getInstitutionPatients(id);
    this.validateForm = this.fb.group({
      userSex: [null, [Validators.required]],
      userName: [null, [Validators.required]],
      userType: [null, [Validators.required]]
    });
  }

  getInstitutionPatients(id: string) {
    this.authService.getInstitutionPatients(id).subscribe(res => {
      this.patientList = res;
    });
  }

  getInstitutionUsers(id: string) {
    this.authService.getInstitutionUsers(id).subscribe(
      res => {
        this.userList = res;
      }
    );
  }

  goBack() {
    this.router.navigate([`admin/institution`]);
  }

  addUser() {
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
    // tslint:disable-next-line:forin
    for (const iterator in this.validateForm.controls) {
      this.validateForm.controls[iterator].markAsDirty();
      this.validateForm.controls[iterator].updateValueAndValidity();
    }
    if (this.validateForm.invalid) {
      return;
    }
    this.isShowModal = false;
    this.addUserInfo();
  }

  addUserInfo() { // 获取用户信息
    if (this.validateForm.invalid) {
      this.warning();
      return;
    }
    this.isConfirmLoading = true;
    const sex = this.validateForm.controls.userSex.value === '2' ? '' : this.validateForm.controls.userSex.value;
    const data = {
      user_name: this.validateForm.controls.userName.value,
      user_sex: sex,
      user_type: this.validateForm.controls.userType.value,
      institution_id: this.institutionId,
    };
    this.authService.addNewUser(data).subscribe(res => {
      this.isShowModal = false;
      this.isConfirmLoading = false;
      this.getInstitutionUsers(this.institutionId);
      this.getInstitutionPatients(this.institutionId);
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
    }
    this.nzModel.warning({
      nzTitle: '错误提示',
      nzContent: errorMsg
    });
  }

  gotoIndtitutionUser(id: string) {
    this.router.navigate([`admin/user-details/${id}`]);
  }

  gotoIndtitutionPatient(id: string) {
    this.router.navigate([`admin/echart`]);
  }
}
