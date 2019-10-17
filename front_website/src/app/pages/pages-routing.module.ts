import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admin/admin.component';
import { RegisterComponent } from './login/register/register.component';
import { ForgetPasswordComponent } from './login/forgrt-password/forgrt-password.component';
import { PagesComponent } from './pages.component';


const routes: Routes = [
    { path: 'login', component: LoginComponent},
    { path: 'register', component: RegisterComponent},
    { path: 'forget-password', component: ForgetPasswordComponent},
    { path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminPageModule), data: {preload: true, } },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class PagesRoutingModule {
}
