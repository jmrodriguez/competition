import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';

import {TodoService} from './todo.service';


import {TodoRoutingModule} from './todo-routing.module';
import {TodoShowComponent} from './todo-show.component';
import {TodoListComponent} from './todo-list.component';
import {TodoPersistComponent} from './todo-persist.component';

@NgModule({
  declarations: [
    TodoListComponent,
    TodoPersistComponent,
    TodoShowComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    TodoRoutingModule
  ],
  providers: [
    TodoService
  ]
})
export class TodoModule {}