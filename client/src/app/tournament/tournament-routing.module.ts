import {NgModule} from '@angular/core';
import {RouterModule,Routes} from '@angular/router';
import {TournamentListComponent} from './tournament-list.component';
import {TournamentPersistComponent} from './tournament-persist.component';
import {TournamentShowComponent} from './tournament-show.component';

const routes: Routes = [
  {path: 'tournament', redirectTo: 'tournament/list', pathMatch: 'full'},
  {path: 'tournament/list', component: TournamentListComponent},
  {path: 'tournament/create', component: TournamentPersistComponent},
  {path: 'tournament/edit/:id', component: TournamentPersistComponent},
  {path: 'tournament/show/:id', component: TournamentShowComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TournamentRoutingModule {}