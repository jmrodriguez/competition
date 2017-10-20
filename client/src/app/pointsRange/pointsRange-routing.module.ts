import {NgModule} from '@angular/core';
import {RouterModule,Routes} from '@angular/router';
import {PointsRangeListComponent} from './pointsRange-list.component';
import {PointsRangePersistComponent} from './pointsRange-persist.component';
import {PointsRangeShowComponent} from './pointsRange-show.component';
import {AuthGuard} from "../guard/auth-guard.service";

const routes: Routes = [
  {path: 'pointsRange', redirectTo: 'pointsRange/list', pathMatch: 'full', canActivate: [AuthGuard], data: { roles: ["ROLE_SUPER_ADMIN", "ROLE_GENERAL_ADMIN", "ROLE_FEDERATION_ADMIN"] }},
  {path: 'pointsRange/list', component: PointsRangeListComponent, canActivate: [AuthGuard], data: { roles: ["ROLE_SUPER_ADMIN", "ROLE_GENERAL_ADMIN", "ROLE_FEDERATION_ADMIN"] }},
  {path: 'pointsRange/create', component: PointsRangePersistComponent, canActivate: [AuthGuard], data: { roles: ["ROLE_SUPER_ADMIN", "ROLE_GENERAL_ADMIN", "ROLE_FEDERATION_ADMIN"] }},
  {path: 'pointsRange/edit/:id', component: PointsRangePersistComponent, canActivate: [AuthGuard], data: { roles: ["ROLE_SUPER_ADMIN", "ROLE_GENERAL_ADMIN", "ROLE_FEDERATION_ADMIN"] }},
  {path: 'pointsRange/show/:id', component: PointsRangeShowComponent, canActivate: [AuthGuard], data: { roles: ["ROLE_SUPER_ADMIN", "ROLE_GENERAL_ADMIN", "ROLE_FEDERATION_ADMIN"] }},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PointsRangeRoutingModule {}