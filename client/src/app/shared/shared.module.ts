import { NgModule }            from '@angular/core';
import { CommonModule }        from '@angular/common';
import { FormsModule }         from '@angular/forms';

import { PaginationComponent }         from './pagination.component';
import {ToastCommunicationService} from "./toast-communication.service";
import {DndModule} from 'ng2-dnd';
import {DragDropConfig, DragDropService, DragDropSortableService} from "ng2-dnd";
import {DialogsModule} from "./dialog/dialogs.module";
import {DialogsService} from "./dialog/dialogs.service";


@NgModule({
    imports:      [ CommonModule, DndModule, DialogsModule ],
    declarations: [ PaginationComponent ],
    exports:      [ PaginationComponent, CommonModule, FormsModule, DndModule, DialogsModule ],
    providers: [
        ToastCommunicationService,
        DragDropService,
        DragDropConfig,
        DragDropSortableService,
        DialogsService
    ]
})
export class SharedModule {}