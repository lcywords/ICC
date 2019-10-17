import { NgModule } from '@angular/core';

// region: your componets & directives
import { MyDraggableDirective } from './directive/my-draggable.directive';

import { StudyDate } from './pipe/study-date.pipe';
import { AgePipe } from './pipe/age.pipe';
import { GenderPipe } from './pipe/gender.pipe';
import { StrTransformPipe } from './pipe/str-transform.pipe';
import { AuthNetModule } from './auth_net_module/auth-net.module';

const SERVICES = [
];

const COMPONENTS = [
];
const DIRECTIVES = [
    MyDraggableDirective
];
const INTERFACES = [];
const PIPES = [
    StudyDate,
    AgePipe,
    GenderPipe,
    StrTransformPipe
];

@NgModule({
    imports: [
        AuthNetModule
    ],
    declarations: [
        // your components
        ...COMPONENTS,
        ...DIRECTIVES,
        ...PIPES,
    ],
    providers: [
        ...SERVICES,
        ...PIPES
    ],
    exports: [
        AuthNetModule,
        ...COMPONENTS,
        ...DIRECTIVES,
        ...INTERFACES,
        ...PIPES,
    ]
})
export class SharedModule { }
