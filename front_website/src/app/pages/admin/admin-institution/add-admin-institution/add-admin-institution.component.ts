import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { NzModalRef, NzModalService, NzMessageService, NzTreeModule } from 'ng-zorro-antd';
import { AuthService } from 'src/app/share_module/auth_net_module/auth/auth.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'add-admin-institution',
  templateUrl: './add-admin-institution.component.html',
  styleUrls: ['./add-admin-institution.component.less']
})
export class AddAdminInstitutionComponent implements OnInit {
  public institutionName: string;
  public institutionAdress: string;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private nzMs: NzMessageService,
    private route: ActivatedRoute,
    private nzTree: NzTreeModule
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

  }

  addInstitution() { // 获取用户信息
    if (!this.institutionName || !this.institutionAdress) {
        return;
    }
  }


}
