import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule, NzCardModule } from 'ng-zorro-antd';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminComponent } from './admin.component';
import { AdminUserComponent } from './admin-user/admin-user.component';
import { AdminInstitutionComponent } from './admin-institution/admin-institution.component';
import { EchartsComponent } from './statistics/echarts.component';
import { ExpertsComponent } from './experts/experts.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { LayoutModule } from 'src/app/pages/layout/layout.module';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminInstitutionDetailComponent } from './admin-institution/admin-institution-detail/admin-institution-detail.component';
import { AddAdminInstitutionComponent } from './admin-institution/add-admin-institution/add-admin-institution.component';
import { AddAdminUserComponent } from './admin-user/add-admin-user/add-admin-user.component';
import { AdminUserDetailComponent } from './admin-user/admin-user-detail/admin-user-detail.component';
import { AddAdminExpertsComponent } from './experts/add-admin-experts/add-admin-experts.component';
import { AdminExpertsDetailComponent } from './experts/admin-experts-detail/admin-experts-detail.component';
import { AdminInstitutionPersonComponent } from './admin-institution/admin-institution-person/admin-institution-person.component';
import { UserGroupListComponent } from './user-group/user-group-list.component';
import { UserGroupDetailComponent } from './user-group/user-group-detail/user-group-detail.component';
import { AddUserGroupComponent } from './user-group/add-user-group/add-user-group.component';



@NgModule({
  declarations: [
    AdminComponent,
    AdminUserComponent,
    AddAdminUserComponent,
    AdminUserDetailComponent,
    AdminInstitutionComponent,
    EchartsComponent,
    ExpertsComponent,
    AdminInstitutionDetailComponent,
    AddAdminInstitutionComponent,
    AddAdminExpertsComponent,
    AdminExpertsDetailComponent,
    AdminInstitutionPersonComponent,
    UserGroupListComponent,
    UserGroupDetailComponent,
    AddUserGroupComponent

  ],
  providers: [
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgZorroAntdModule,
    ReactiveFormsModule,
    NgxEchartsModule,
    NzCardModule,
    LayoutModule,
    AdminRoutingModule
  ]
})
export class AdminPageModule {}
