import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Tournament} from './tournament';
import {TournamentService} from './tournament.service';
import {TranslateService} from '@ngx-translate/core';
import {Observable} from "rxjs/Observable";
import {Player} from "../player/player";
import {Subject} from "rxjs/Subject";
import {PlayerService} from "../player/player.service";

@Component({
  selector: 'tournament-persist',
  templateUrl: './tournament-show.component.html'
})
export class TournamentShowComponent implements OnInit {

  tournament = new Tournament();

  private sub: any;
  total: Observable<number>;
  players: Observable<Player[]>;

  page: number = 1;
  terms: string = "";
  playerType:number = 0;

  private playerTypeStream = new Subject<number>();
  private searchTermStream = new Subject<string>();
  private pageStream = new Subject<number>();

  constructor(private route: ActivatedRoute,
              private tournamentService: TournamentService,
              private playerService: PlayerService,
              private router: Router,
              private translateService:TranslateService) {
    this.sub = this.route.params.subscribe(params => {
      let page = params['page'];
      if (page != null) {
        this.page = +page; // (+) converts string 'id' to a number
      }

      let terms = params['q'];
      if (terms != null) {
        this.terms = params['q'];
      }
    });
  }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.tournamentService.get(+params['id']).subscribe((tournament: Tournament) => {
        this.tournament = tournament;
        this._loadPlayers();
      });
    });
  }

  private _loadPlayers():void {

    console.log("Loading tournament players");
    const playerTypeSource = this.playerTypeStream.map(playerType => {
      this.playerType = playerType;
      return {search: this.terms, page: this.page, playerType: playerType}
    });

    const pageSource = this.pageStream.map(pageNumber => {
      this.page = pageNumber;
      return {search: this.terms, page: pageNumber, playerType: this.playerType}
    });

    const searchSource = this.searchTermStream
        .debounceTime(1000)
        .distinctUntilChanged()
        .map(searchTerm => {
          this.terms = searchTerm;
          return {search: searchTerm, page: 1, playerType: this.playerType}
        });

    const source = pageSource
        .merge(searchSource)
        .merge(playerTypeSource)
        .startWith({search: this.terms, page: this.page, playerType: this.playerType})
        .mergeMap((params: {search: string, page: number, playerType: number}) => {
          return this.playerService.list(this.tournament, params.search, params.page, params.playerType);
        })
        .share();

    this.total = source.pluck('total');
    this.players = source.pluck('list');
  }

  search(terms: string) {
    this.searchTermStream.next(terms)
  }

  goToPage(page: number) {
    this.pageStream.next(page)
  }

  viewPlayerType(event: any) {
    this.playerTypeStream.next(event.index)
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
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
