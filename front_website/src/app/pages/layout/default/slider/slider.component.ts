import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.less']
})
export class SidebarComponent {
  constructor(
    public msgSrv: NzMessageService,
    private router: Router,
  ) {
  }
  // { name: 'Dashboard', active: 0 },
  // { name: 'Institutions', active: 1 },
  // { name: 'Users', active: 2 },
  // { name: 'Experts', active: 3 }
  public navList = [
    {
      index: 0,
      name: 'Dashboard',
      link: '/admin/echart',
      isActive: true,
      isShow: true,
      type: 'user'
    },
    {
      index: 1,
      name: 'Institutions',
      link: '/admin/institution',
      isActive: false,
      isShow: true,
      type: 'user'
    },
    {
      index: 2,
      name: 'Users',
      link: '/admin/user',
      isActive: false,
      isShow: true,
      type: 'user'
    },
    {
      index: 3,
      name: 'Experts',
      link: '/admin/experts',
      isActive: false,
      isShow: true,
      type: 'user'
    },
    {
      index: 4,
      name: 'UserGroup',
      link: '/admin/user-group-list',
      isActive: false,
      isShow: true,
      type: 'user'
    },
  ];

  gotoMenu = (i) => {
    // tslint:disable-next-line:no-string-literal
    console.log('--------->', i, this.navList[i]['link']);

    // tslint:disable-next-line:no-string-literal
    this.router.navigate( [this.navList[i]['link']] );
  }
}
