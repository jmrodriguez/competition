import {NgModule} from '@angular/core';
import {RouterModule,Routes} from '@angular/router';
import {CategoryListComponent} from './category-list.component';
import {CategoryPersistComponent} from './category-persist.component';
import {CategoryShowComponent} from './category-show.component';

const routes: Routes = [
  {path: 'category', redirectTo: 'category/list', pathMatch: 'full'},
  {path: 'category/list', component: CategoryListComponent},
  {path: 'category/create', component: CategoryPersistComponent},
  {path: 'category/edit/:id', component: CategoryPersistComponent},
  {path: 'category/show/:id', component: CategoryShowComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoryRoutingModule {}