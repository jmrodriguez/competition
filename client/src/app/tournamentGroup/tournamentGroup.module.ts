import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {TournamentGroupService} from "./tournamentGroup.service";


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
  ],
  providers: [
      TournamentGroupService
  ]
})
export class TournamentGroupModule {}