import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.less']
})
export class FooterComponent implements OnInit, AfterContentChecked {
    private getGlobal: string;
    public collapsed: boolean;
    public isDashboardShow = true;
    public navList = [
        {
            index: 0,
            name: '任务管理',
            link: '/followup/followup-scan/followup-workflow/1',
            isActive: false,
            activeImgSrc: './assets/img/common/followup_active.png',
            inactiveImgSrc: './assets/img/common/followup_inactive.png',
            isShow: true,
        },
        {
            index: 1,
            name: '患者管理',
            link: '/pacs/patient-scan/patient-list',
            isActive: false,
            activeImgSrc: './assets/img/patient-list/patient_management_active.png',
            inactiveImgSrc: './assets/img/patient-list/patient_management_inactive.png',
            isShow: true,
        },
        {
            index: 2,
            name: '设备管理',
            link: '/institute/institute-scan/institute-list',
            isActive: false,
            activeImgSrc: './assets/img/patient-list/institution_management_active.png',
            inactiveImgSrc: './assets/img/patient-list/institution_management_inactive.png',
            isShow: true,
        },
        {
            index: 3,
            name: '科研管理',
            link: '/research/research-scan/research-list',
            isActive: false,
            activeImgSrc: './assets/img/patient-list/statistics_active.png',
            inactiveImgSrc: './assets/img/patient-list/statistics_inactive.png',
            isShow: true,
        },
        {
            index: 4,
            name: '科室管理',
            link: '/statistics',
            isActive: false,
            activeImgSrc: './assets/img/common/followup_active.png',
            inactiveImgSrc: './assets/img/common/followup_inactive.png',
            isShow: true,
        },
        {
            index: 5,
            name: '工作平台',
            link: '/dashboard/monitor',
            isActive: true,
            activeImgSrc: './assets/img/common/followup_active.png',
            inactiveImgSrc: './assets/img/common/followup_inactive.png',
            isShow: true,
        },
    ];
    public urlPath;
    constructor(
        private router: Router,
        private nzMs: NzMessageService,
        private route: ActivatedRoute
    ) {
    }
    toggleCollapsedSidebar() {
        console.log('toogle collapsed sidebar');
        this.collapsed = !this.collapsed;
        document.querySelector('body').classList.toggle('aside-collapsed');
    }


    ngOnInit() {

    }

    ngAfterContentChecked() {
        this.navList.forEach(row => {
            row.isActive = false;
            if (this.router.url.split('/')[1] === row.link.split('/')[1]) {
              row.isActive = true;
            }
          });
    }

    activeAnchor = (list: any) => {
        this.navList.forEach(ele => {
            ele.isActive = false;
        });
        list.isActive = true;
        // tslint:disable-next-line:no-string-literal
        this.isDashboardShow = list['name'] === '工作平台';
        console.log('nav list is:', list);
        this.router.navigate([list.link]);
    }

    showQuestion = () => {
        this.nzMs.info('努力进行中...');
    }

    gotoMenu = () => {
        // tslint:disable-next-line:quotemark
        this.router.navigate(["/dashboard/menu"]);
    }

    gotoHome = () => {
        // tslint:disable-next-line:quotemark
        this.router.navigate(["/dashboard/monitor"]);
    }

}
