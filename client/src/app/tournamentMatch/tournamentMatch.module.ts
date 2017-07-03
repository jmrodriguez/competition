import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {TournamentMatchService} from "./tournamentMatch.service";


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
  ],
  providers: [
      TournamentMatchService
  ]
})
export class TournamentMatchModule {}