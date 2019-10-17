import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule, NzCardModule } from 'ng-zorro-antd';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PagesComponent } from './pages.component';
import { PagesRoutingModule } from './pages-routing.module';
import { AdminPageModule } from './admin/admin.module';

@NgModule({
  declarations: [
    PagesComponent
  ],
  providers: [
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgZorroAntdModule,
    ReactiveFormsModule,
    NzCardModule,
    AdminPageModule,
    PagesRoutingModule
  ]
})
export class PageModule {}
