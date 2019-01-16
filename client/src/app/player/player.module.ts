import {NgModule} from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import {FileUploadModule} from 'ng2-file-upload';
import { TranslateModule } from '@ngx-translate/core';
import {PlayerService} from './player.service';


import {PlayerRoutingModule} from './player-routing.module';
import {PlayerShowComponent} from './player-show.component';
import {PlayerListComponent} from './player-list.component';
import {PlayerRankingComponent} from './player-ranking.component';
import {PlayerPersistComponent} from './player-persist.component';
import { TournamentModule } from '../tournament/tournament.module';
import { FederationModule } from '../federation/federation.module';

@NgModule({
  declarations: [
    PlayerListComponent,
    PlayerRankingComponent,
    PlayerPersistComponent,
    PlayerShowComponent,
  ],
  imports: [
    SharedModule,
    FileUploadModule,
    TranslateModule,
    PlayerRoutingModule,
    TournamentModule,
    FederationModule
],
  providers: [
    PlayerService
  ]
})
export class PlayerModule {}