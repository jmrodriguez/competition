import {NgModule} from '@angular/core';
import {SharedModule} from "../shared/shared.module";
import { TranslateModule } from '@ngx-translate/core';
import {TournamentService} from './tournament.service';

import {TournamentRoutingModule} from './tournament-routing.module';
import {TournamentShowComponent} from './tournament-show.component';
import {TournamentListComponent} from './tournament-list.component';
import {TournamentPersistComponent} from './tournament-persist.component';
import {TournamentPlanComponent} from './tournament-plan.component';
import { WeightModule } from '../weight/weight.module';
import { FederationModule } from '../federation/federation.module';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MdTabsModule} from "@angular/material";
import {MatchResultPipe} from "./match-result-pipe";
import { BracketDirective } from '../directives/bracket.directive';

@NgModule({
  declarations: [
    TournamentListComponent,
    TournamentPersistComponent,
    TournamentShowComponent,
    TournamentPlanComponent,
    MatchResultPipe,
    BracketDirective
  ],
  imports: [
    SharedModule,
    BrowserAnimationsModule,
    TranslateModule,
    TournamentRoutingModule,
    WeightModule,
    FederationModule
  ],
  providers: [
    TournamentService
  ]
})
export class TournamentModule {}