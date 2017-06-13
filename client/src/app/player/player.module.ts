import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';

import {PlayerService} from './player.service';


import {PlayerRoutingModule} from './player-routing.module';
import {PlayerShowComponent} from './player-show.component';
import {PlayerListComponent} from './player-list.component';
import {PlayerPersistComponent} from './player-persist.component';
import { TournamentModule } from '../tournament/tournament.module';
import { FederationModule } from '../federation/federation.module';

@NgModule({
  declarations: [
    PlayerListComponent,
    PlayerPersistComponent,
    PlayerShowComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    PlayerRoutingModule,
    TournamentModule,
    FederationModule
],
  providers: [
    PlayerService
  ]
})
export class PlayerModule {}