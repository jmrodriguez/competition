import {NgModule} from '@angular/core';
import {RouterModule,Routes} from '@angular/router';
import {CategoryListComponent} from './category-list.component';
import {CategoryPersistComponent} from './category-persist.component';
import {CategoryShowComponent} from './category-show.component';
import { AuthGuard } from '../guard/auth-guard.service';

const routes: Routes = [
  {path: 'category', redirectTo: 'category/list', pathMatch: 'full', canActivate: [AuthGuard], data: { roles: ["ROLE_SUPER_ADMIN"] }},
  {path: 'category/list', component: CategoryListComponent, canActivate: [AuthGuard], data: { roles: ["ROLE_SUPER_ADMIN"] }},
  {path: 'category/create', component: CategoryPersistComponent, canActivate: [AuthGuard], data: { roles: ["ROLE_SUPER_ADMIN"] }},
  {path: 'category/edit/:id', component: CategoryPersistComponent, canActivate: [AuthGuard], data: { roles: ["ROLE_SUPER_ADMIN"] }},
  {path: 'category/show/:id', component: CategoryShowComponent, canActivate: [AuthGuard], data: { roles: ["ROLE_SUPER_ADMIN"] }},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoryRoutingModule {}