import {NgModule} from '@angular/core';
import {RouterModule,Routes} from '@angular/router';
import {TodoListComponent} from './todo-list.component';
import {TodoPersistComponent} from './todo-persist.component';
import {TodoShowComponent} from './todo-show.component';

const routes: Routes = [
  {path: 'todo', redirectTo: 'todo/list', pathMatch: 'full'},
  {path: 'todo/list', component: TodoListComponent},
  {path: 'todo/create', component: TodoPersistComponent},
  {path: 'todo/edit/:id', component: TodoPersistComponent},
  {path: 'todo/show/:id', component: TodoShowComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TodoRoutingModule {}