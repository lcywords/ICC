import { NgModule } from '@angular/core';
import { HeaderComponent } from './default/header/header.component';
import { FooterComponent } from './default/footer/footer.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { SidebarComponent } from './default/slider/slider.component';

const COMPONENTS = [
    HeaderComponent,
    FooterComponent,
    SidebarComponent
];

const HEADERCOMPONENTS = [

];

// passport
const PASSPORT = [
];

@NgModule({
    imports: [
        NgZorroAntdModule,
    ],
    providers: [],
    declarations: [
        ...COMPONENTS,
        ...HEADERCOMPONENTS,
        ...PASSPORT
    ],
    exports: [
        ...COMPONENTS,
        ...PASSPORT
    ]
})
export class LayoutModule { }
