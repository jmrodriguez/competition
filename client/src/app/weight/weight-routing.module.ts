import {NgModule} from '@angular/core';
import {RouterModule,Routes} from '@angular/router';
import {WeightListComponent} from './weight-list.component';
import {WeightPersistComponent} from './weight-persist.component';
import {WeightShowComponent} from './weight-show.component';
import { AuthGuard } from '../guard/auth-guard.service';

const routes: Routes = [
  {path: 'weight', redirectTo: 'weight/list', pathMatch: 'full', canActivate: [AuthGuard], data: { roles: ["ROLE_SUPER_ADMIN", "ROLE_GENERAL_ADMIN"] }},
  {path: 'weight/list', component: WeightListComponent, canActivate: [AuthGuard], data: { roles: ["ROLE_SUPER_ADMIN", "ROLE_GENERAL_ADMIN"] }},
  {path: 'weight/create', component: WeightPersistComponent, canActivate: [AuthGuard], data: { roles: ["ROLE_SUPER_ADMIN", "ROLE_GENERAL_ADMIN"] }},
  {path: 'weight/edit/:id', component: WeightPersistComponent, canActivate: [AuthGuard], data: { roles: ["ROLE_SUPER_ADMIN", "ROLE_GENERAL_ADMIN"] }},
  {path: 'weight/show/:id', component: WeightShowComponent, canActivate: [AuthGuard], data: { roles: ["ROLE_SUPER_ADMIN", "ROLE_GENERAL_ADMIN"] }},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WeightRoutingModule {}