import { NgModule }            from '@angular/core';
import { CommonModule }        from '@angular/common';
import { FormsModule }         from '@angular/forms';

import {ToastCommunicationService} from "./toast-communication.service";
import {DndModule} from 'ng2-dnd';
import {DragDropConfig, DragDropService, DragDropSortableService} from "ng2-dnd";
import {DialogsModule} from "./dialog/dialogs.module";
import {DialogsService} from "./dialog/dialogs.service";
import {MatInputModule, MatPaginatorModule, MatTableModule, MatTabsModule, MatSortModule} from "@angular/material";


@NgModule({
    imports:      [ CommonModule, DndModule, DialogsModule, MatInputModule, MatTabsModule, MatTableModule, MatPaginatorModule, MatSortModule ],
    declarations: [ ],
    exports:      [ CommonModule, FormsModule, DndModule, DialogsModule, MatInputModule, MatTabsModule, MatTableModule, MatPaginatorModule, MatSortModule ],
    providers: [
        ToastCommunicationService,
        DragDropService,
        DragDropConfig,
        DragDropSortableService,
        DialogsService
    ]
})
export class SharedModule {}