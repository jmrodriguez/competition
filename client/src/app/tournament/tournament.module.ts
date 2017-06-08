import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';

import {TournamentService} from './tournament.service';


import {TournamentRoutingModule} from './tournament-routing.module';
import {TournamentShowComponent} from './tournament-show.component';
import {TournamentListComponent} from './tournament-list.component';
import {TournamentPersistComponent} from './tournament-persist.component';
import { WeightModule } from '../weight/weight.module';
import { FederationModule } from '../federation/federation.module';

@NgModule({
  declarations: [
    TournamentListComponent,
    TournamentPersistComponent,
    TournamentShowComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    TournamentRoutingModule,
    WeightModule,
    FederationModule
  ],
  providers: [
    TournamentService
  ]
})
export class TournamentModule {}