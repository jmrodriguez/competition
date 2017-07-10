import { NgModule }            from '@angular/core';
import { CommonModule }        from '@angular/common';
import { FormsModule }         from '@angular/forms';

import { PaginationComponent }         from './pagination.component';
import {ToastCommunicationService} from "./toast-communication.service";


@NgModule({
    imports:      [ CommonModule ],
    declarations: [ PaginationComponent ],
    exports:      [ PaginationComponent, CommonModule, FormsModule ],
    providers: [
        ToastCommunicationService
    ]
})
export class SharedModule {}