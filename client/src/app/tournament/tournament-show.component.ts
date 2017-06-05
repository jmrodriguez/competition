import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Tournament} from './tournament';
import {TournamentService} from './tournament.service';

@Component({
  selector: 'tournament-persist',
  templateUrl: './tournament-show.component.html'
})
export class TournamentShowComponent implements OnInit {

  tournament = new Tournament();

  constructor(private route: ActivatedRoute, private tournamentService: TournamentService, private router: Router) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.tournamentService.get(+params['id']).subscribe((tournament: Tournament) => {
        this.tournament = tournament;
      });
    });
  }

  destroy() {
    if (confirm("Are you sure?")) {
      this.tournamentService.destroy(this.tournament).subscribe((success: boolean) => {
        if (success) {
          this.router.navigate(['/tournament','list']);
        } else {
          alert("Error occurred during delete");
        }
      });
    }
  }

}
