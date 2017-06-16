import {NgModule} from '@angular/core';
import {SharedModule} from "../shared/shared.module";
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
    SharedModule,
    TournamentRoutingModule,
    WeightModule,
    FederationModule
  ],
  providers: [
    TournamentService
  ]
})
export class TournamentModule {}