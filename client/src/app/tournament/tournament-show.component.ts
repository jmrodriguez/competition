import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Tournament} from './tournament';
import {TournamentService} from './tournament.service';
import {Observable} from "rxjs/Observable";
import {Player} from "../player/player";
import {Subject} from "rxjs/Subject";
import {PlayerService} from "../player/player.service";
import {Category} from "../category/category";
import {ToastCommunicationService} from "../shared/toast-communication.service";
import {MdPaginator, MdSort} from "@angular/material";
import {PlayerDataSource} from "app/player/player.datasource";

@Component({
  selector: 'tournament-persist',
  templateUrl: './tournament-show.component.html'
})
export class TournamentShowComponent implements OnInit {

  displayedColumns = ['id', 'firstName', 'lastName', 'email', 'dni', 'club', 'birth'];
  @ViewChild(MdPaginator) paginator: MdPaginator;
  @ViewChild(MdSort) sort: MdSort;

  playerDatasource: PlayerDataSource | null;

  tournament = new Tournament();

  private tournamentStream = new Subject<Tournament>();
  private playerTypeStream = new Subject<number>();
  private searchTermStream = new Subject<string>();

  constructor(private route: ActivatedRoute,
              private tournamentService: TournamentService,
              private playerService: PlayerService,
              private router: Router,
              private toastCommunicationService: ToastCommunicationService) {}

  ngOnInit() {
    this.playerDatasource = new PlayerDataSource(this.tournamentStream, this.searchTermStream, this.playerTypeStream, this.paginator, this.sort, this.playerService);
    this.route.params.subscribe((params: Params) => {
      this.tournamentService.get(+params['id']).subscribe((tournament: Tournament) => {
        this.tournament = tournament;
        this.tournamentStream.next(this.tournament);
      });
    });
  }

  search(terms: string) {
    this.searchTermStream.next(terms);
  }

  goToGameplan() {
    this.router.navigate(['/tournament/gameplan', this.tournament.id]);
  }

  viewPlayerType(event: any) {
    this.playerTypeStream.next(event.index);
  }

  signUpPlayer(player: Player) {
    this.tournamentService.signUpPlayer(this.tournament, player).subscribe(success => {
      if (success) {
        this.toastCommunicationService.showToast(this.toastCommunicationService.SUCCESS, 'tournament.show.players.signup.success');
        // this refreshes the list
        this.tournamentStream.next(this.tournament);
      } else {
        this.toastCommunicationService.showToast(this.toastCommunicationService.ERROR, 'tournament.show.players.signup.failure');
      }
    })
  }

  signOffPlayer(player: Player) {
    this.tournamentService.signOffPlayer(this.tournament, player).subscribe(success => {
      if (success) {
        this.toastCommunicationService.showToast(this.toastCommunicationService.SUCCESS, 'tournament.show.players.signoff.success');
        // this refreshes the list
        this.tournamentStream.next(this.tournament);
      } else {
        this.toastCommunicationService.showToast(this.toastCommunicationService.ERROR, 'tournament.show.players.signoff.failure');
      }
    })
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
