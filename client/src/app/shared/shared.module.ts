import { NgModule }            from '@angular/core';
import { CommonModule }        from '@angular/common';
import { FormsModule }         from '@angular/forms';

import { PaginationComponent }         from './pagination.component';
import {ToastCommunicationService} from "./toast-communication.service";
import {DndModule} from 'ng2-dnd';
import {DragDropConfig, DragDropService, DragDropSortableService} from "ng2-dnd";
import {DialogsModule} from "./dialog/dialogs.module";
import {DialogsService} from "./dialog/dialogs.service";
import {MdInputModule, MdPaginatorModule, MdTableModule, MdTabsModule, MdSortModule} from "@angular/material";
import {CdkTableModule} from "@angular/cdk";


@NgModule({
    imports:      [ CommonModule, DndModule, DialogsModule, MdInputModule, MdTabsModule, CdkTableModule, MdTableModule, MdPaginatorModule, MdSortModule ],
    declarations: [ PaginationComponent ],
    exports:      [ PaginationComponent, CommonModule, FormsModule, DndModule, DialogsModule, MdInputModule, MdTabsModule, CdkTableModule, MdTableModule, MdPaginatorModule, MdSortModule ],
    providers: [
        ToastCommunicationService,
        DragDropService,
        DragDropConfig,
        DragDropSortableService,
        DialogsService
    ]
})
export class SharedModule {}