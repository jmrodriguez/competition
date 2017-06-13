import {NgModule} from '@angular/core';
import {RouterModule,Routes} from '@angular/router';
import {PlayerListComponent} from './player-list.component';
import {PlayerPersistComponent} from './player-persist.component';
import {PlayerShowComponent} from './player-show.component';
import {AuthGuard} from "../guard/auth-guard.service";

const routes: Routes = [
  {path: 'player', redirectTo: 'player/list', pathMatch: 'full', canActivate: [AuthGuard], data: { roles: ["ROLE_FEDERATION_ADMIN"] }},
  {path: 'player/list', component: PlayerListComponent, canActivate: [AuthGuard], data: { roles: ["ROLE_FEDERATION_ADMIN"] }},
  {path: 'player/create', component: PlayerPersistComponent, canActivate: [AuthGuard], data: { roles: ["ROLE_FEDERATION_ADMIN"] }},
  {path: 'player/edit/:id', component: PlayerPersistComponent, canActivate: [AuthGuard], data: { roles: ["ROLE_FEDERATION_ADMIN"] }},
  {path: 'player/show/:id', component: PlayerShowComponent, canActivate: [AuthGuard], data: { roles: ["ROLE_FEDERATION_ADMIN"] }},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlayerRoutingModule {}