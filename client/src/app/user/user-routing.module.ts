import {NgModule} from '@angular/core';
import {RouterModule,Routes} from '@angular/router';
import {UserListComponent} from './user-list.component';
import {UserPersistComponent} from './user-persist.component';
import {UserShowComponent} from './user-show.component';
import {AuthGuard} from "../guard/auth-guard.service";

const routes: Routes = [
  {path: 'user', redirectTo: 'user/list', pathMatch: 'full', canActivate: [AuthGuard], data: { roles: ["ROLE_SUPER_ADMIN"] }},
  {path: 'user/list', component: UserListComponent, canActivate: [AuthGuard], data: { roles: ["ROLE_SUPER_ADMIN"] }},
  {path: 'user/create', component: UserPersistComponent, canActivate: [AuthGuard], data: { roles: ["ROLE_SUPER_ADMIN"] }},
  {path: 'user/edit/:id', component: UserPersistComponent, canActivate: [AuthGuard], data: { roles: ["ROLE_SUPER_ADMIN", "ROLE_GENERAL_ADMIN"] }},
  {path: 'user/show/:id', component: UserShowComponent, canActivate: [AuthGuard], data: { roles: ["ROLE_SUPER_ADMIN", "ROLE_GENERAL_ADMIN"] }},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule {}