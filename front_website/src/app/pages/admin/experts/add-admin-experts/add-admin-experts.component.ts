import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { NzModalRef, NzModalService, NzMessageService, NzTreeModule } from 'ng-zorro-antd';
import { AuthService } from 'src/app/share_module/auth_net_module/auth/auth.service';

@Component({
  selector: 'add-admin-experts',
  templateUrl: './add-admin-experts.component.html',
  styleUrls: ['./add-admin-experts.component.less']
})
export class AddAdminExpertsComponent implements OnInit {

  institutionList = [];
  institution_name: string;
  user_sex: string;
  user_name: string;
  user_type: string;
  user_mobile: string;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private nzMs: NzMessageService,
    private route: ActivatedRoute,
    private nzTree: NzTreeModule,
    private nzModel: NzModalService
  ) {
    this.validateForm = this.fb.group({
    });
  }
  validateForm: FormGroup;
  userForm = {
    username: '',
    user_id: '',
  };


  ngOnInit() {
    // this.getInstitutionList();
  }

  getInstitutionList() {
    this.authService.getInstitutionList().subscribe(res => {
      let tempList = [];
      tempList = res as Array<any>;
      tempList.forEach((item) => {
        if (item['parent'] && item['parent'].length == 0) {
          this.institutionList.push(item);
        }
      });

    });
  }

  addNewExpert() { // 获取用户信息
    if (!this.institution_name || !this.user_name || !this.user_name) {
      this.warning()
      return;
    }
    const data = {
      user_name: this.user_name,
      user_sex: this.user_sex,
      user_type: this.user_type,
      institution_name: this.institution_name,
      user_mobile: this.user_mobile
    }
    this.authService.addNewExpert(data).subscribe(res => {
      this.router.navigate(['/admin/experts']);
    });
  }

  warning(): void {
    this.nzModel.warning({
      nzTitle: '信息填写不完整',
      nzContent: '必要信息：用户名，机构。'
    });
  }


}
