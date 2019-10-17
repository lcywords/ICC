import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AdminUserComponent } from './admin-user/admin-user.component';
import { EchartsComponent } from './statistics/echarts.component';
import { ExpertsComponent } from './experts/experts.component';
import { AdminInstitutionComponent } from './admin-institution/admin-institution.component';
import { AdminComponent } from './admin.component';
import { AdminInstitutionDetailComponent } from './admin-institution/admin-institution-detail/admin-institution-detail.component';
import { AddAdminInstitutionComponent } from './admin-institution/add-admin-institution/add-admin-institution.component';
import { AddAdminUserComponent } from './admin-user/add-admin-user/add-admin-user.component';
import { AdminUserDetailComponent } from './admin-user/admin-user-detail/admin-user-detail.component';
import { AdminExpertsDetailComponent } from './experts/admin-experts-detail/admin-experts-detail.component';
import { AddAdminExpertsComponent } from './experts/add-admin-experts/add-admin-experts.component';
import { AdminInstitutionPersonComponent } from './admin-institution/admin-institution-person/admin-institution-person.component';
import { UserGroupListComponent } from './user-group/user-group-list.component';
import { UserGroupDetailComponent } from './user-group/user-group-detail/user-group-detail.component';
import { AddUserGroupComponent } from './user-group/add-user-group/add-user-group.component';


const routes: Routes = [
    {
        path: 'admin',
        component: AdminComponent,
        children: [
            { path: 'user', component: AdminUserComponent },
            { path: 'echart', component: EchartsComponent },
            { path: 'experts', component: ExpertsComponent },
            { path: 'institution', component: AdminInstitutionComponent },
            { path: 'institution-details/:id', component: AdminInstitutionDetailComponent, },
            { path: 'institution-person/:id', component: AdminInstitutionPersonComponent, },
            { path: 'add-institution', component: AddAdminInstitutionComponent, },
            { path: 'user-details/:id', component: AdminUserDetailComponent, },
            { path: 'add-user', component: AddAdminUserComponent, },
            { path: 'experts-details/:id', component: AdminExpertsDetailComponent, },
            { path: 'add-experts', component: AddAdminExpertsComponent, },
            { path: 'user-group-list', component: UserGroupListComponent, },
            { path: 'add-user-group', component: AddUserGroupComponent, },
            { path: 'user-group-details/:id', component: UserGroupDetailComponent, }
        ],
        // canActivate: [AuthGuard]
    }

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AdminRoutingModule {
}

