import {NgModule} from '@angular/core';
import {RouterModule,Routes} from '@angular/router';
import {TournamentCategoryPersistComponent} from './tournamentCategory-persist.component';
import {AuthGuard} from "../guard/auth-guard.service";

const routes: Routes = [
  {path: 'tournamentCategory/:tournamentId/:categoryId', component: TournamentCategoryPersistComponent, canActivate: [AuthGuard], data: { roles: ["ROLE_SUPER_ADMIN", "ROLE_GENERAL_ADMIN", "ROLE_FEDERATION_ADMIN"] }},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TournamentCategoryRoutingModule {}