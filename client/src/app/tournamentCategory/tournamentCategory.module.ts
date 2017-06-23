import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';

import {TournamentCategoryService} from './tournamentCategory.service';


import {TournamentCategoryRoutingModule} from './tournamentCategory-routing.module';
import {TournamentCategoryPersistComponent} from './tournamentCategory-persist.component';
import { MatchModule } from '../match/match.module';
import { GroupModule } from '../group/group.module';
import { TournamentModule } from '../tournament/tournament.module';
import { CategoryModule } from '../category/category.module';

@NgModule({
  declarations: [
    TournamentCategoryPersistComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    TournamentCategoryRoutingModule,
    MatchModule,
    GroupModule,
    TournamentModule,
    CategoryModule
],
  providers: [
    TournamentCategoryService
  ]
})
export class TournamentCategoryModule {}