import {Component, OnInit} from '@angular/core';
import {TournamentService} from './tournament.service';
import {Tournament} from './tournament';

@Component({
  selector: 'tournament-list',
  templateUrl: './tournament-list.component.html'
})
export class TournamentListComponent implements OnInit {

  tournamentList: Tournament[] = [];

  constructor(private tournamentService: TournamentService) { }

  ngOnInit() {
    this.tournamentService.list().subscribe((tournamentList: Tournament[]) => {
      this.tournamentList = tournamentList;
    });
  }
}
