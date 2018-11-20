import {NgModule} from '@angular/core';
import {RouterModule,Routes} from '@angular/router';
import {TournamentListComponent} from './tournament-list.component';
import {TournamentPersistComponent} from './tournament-persist.component';
import {TournamentShowComponent} from './tournament-show.component';
import {AuthGuard} from "../guard/auth-guard.service";
import {TournamentPlanComponent} from "./tournament-plan.component";

const routes: Routes = [
  {path: 'tournament', redirectTo: 'tournament/list', pathMatch: 'full', canActivate: [AuthGuard], data: { roles: [] }},
  {path: 'tournament/list', component: TournamentListComponent, canActivate: [AuthGuard], data: { roles: [] }},
  {path: 'tournament/create', component: TournamentPersistComponent, canActivate: [AuthGuard], data: { roles: ["ROLE_SUPER_ADMIN", "ROLE_GENERAL_ADMIN", "ROLE_FEDERATION_ADMIN"] }},
  {path: 'tournament/edit/:id', component: TournamentPersistComponent, canActivate: [AuthGuard], data: { roles: ["ROLE_SUPER_ADMIN", "ROLE_GENERAL_ADMIN", "ROLE_FEDERATION_ADMIN"] }},
  {path: 'tournament/show/:id', component: TournamentShowComponent, canActivate: [AuthGuard], data: { roles: ["ROLE_SUPER_ADMIN", "ROLE_GENERAL_ADMIN", "ROLE_FEDERATION_ADMIN"] }},
  {path: 'tournament/gameplan/:id', component: TournamentPlanComponent, canActivate: [AuthGuard], data: { roles: [] }},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TournamentRoutingModule {}