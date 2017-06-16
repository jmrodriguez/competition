import { NgModule }            from '@angular/core';
import { CommonModule }        from '@angular/common';
import { FormsModule }         from '@angular/forms';

import { PaginationComponent }         from './pagination.component';

@NgModule({
    imports:      [ CommonModule ],
    declarations: [ PaginationComponent ],
    exports:      [ PaginationComponent, CommonModule, FormsModule ]
})
export class SharedModule { }