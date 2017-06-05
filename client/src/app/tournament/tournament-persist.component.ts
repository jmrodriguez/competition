import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Tournament} from './tournament';
import {TournamentService} from './tournament.service';
import {Response} from "@angular/http";


@Component({
  selector: 'tournament-persist',
  templateUrl: './tournament-persist.component.html'
})
export class TournamentPersistComponent implements OnInit {

  tournament = new Tournament();
  create = true;
  errors: any[];
  

  constructor(private route: ActivatedRoute, private tournamentService: TournamentService, private router: Router) {}

  ngOnInit() {
    
    this.route.params.subscribe((params: Params) => {
      if (params.hasOwnProperty('id')) {
        this.tournamentService.get(+params['id']).subscribe((tournament: Tournament) => {
          this.create = false;
          this.tournament = tournament;
        });
      }
    });
  }

  save() {
    this.tournamentService.save(this.tournament).subscribe((tournament: Tournament) => {
      this.router.navigate(['/tournament', 'show', tournament.id]);
    }, (res: Response) => {
      const json = res.json();
      if (json.hasOwnProperty('message')) {
        this.errors = [json];
      } else {
        this.errors = json._embedded.errors;
      }
    });
  }
}
