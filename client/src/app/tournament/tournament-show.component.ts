import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Tournament} from './tournament';
import {TournamentService} from './tournament.service';
import {TranslateService} from '@ngx-translate/core';
import {Observable} from "rxjs/Observable";
import {Player} from "../player/player";
import {Subject} from "rxjs/Subject";
import {PlayerService} from "../player/player.service";
import {Category} from "../category/category";
import { FlashMessagesService } from 'ngx-flash-messages';

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
  gamePlanAvailable:boolean = false;

  private playerTypeStream = new Subject<number>();
  private searchTermStream = new Subject<string>();
  private pageStream = new Subject<number>();

  constructor(private route: ActivatedRoute,
              private tournamentService: TournamentService,
              private playerService: PlayerService,
              private router: Router,
              private translateService:TranslateService,
              private flashMessagesService: FlashMessagesService) {
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
      return {search: this.terms, page: 1, playerType: playerType, category: this.tournament.category}
    });

    const pageSource = this.pageStream.map(pageNumber => {
      this.page = pageNumber;
      return {search: this.terms, page: pageNumber, playerType: this.playerType, category: this.tournament.category}
    });

    const searchSource = this.searchTermStream
        .debounceTime(1000)
        .distinctUntilChanged()
        .map(searchTerm => {
          this.terms = searchTerm;
          return {search: searchTerm, page: 1, playerType: this.playerType, category: this.tournament.category}
        });

    const source = pageSource
        .merge(searchSource)
        .merge(playerTypeSource)
        .startWith({search: this.terms, page: this.page, playerType: this.playerType, category: this.tournament.category})
        .mergeMap((params: {search: string, page: number, playerType: number, category: Category}) => {
          return this.playerService.list(this.tournament, params.search, params.page, null, params.playerType, params.category);
        })
        .share();

    this.total = source.pluck('total');
    this.players = source.pluck('list');

    this.total.subscribe(total => {
      this.gamePlanAvailable = this.playerType == 0 && total > 8
    })
  }

  search(terms: string) {
    this.searchTermStream.next(terms);
  }

  goToPage(page: number) {
    this.pageStream.next(page);
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
        this.translateService.get('tournament.show.players.signup.success', {}).subscribe((res: string) => {
          this.flashMessagesService.show(res, { classes: ['alert-success'], timeout: 5000 });
          this._loadPlayers()
        });
      } else {
        this.translateService.get('tournament.show.players.signup.failure', {}).subscribe((res: string) => {
          this.flashMessagesService.show(res, { classes: ['alert-danger'], timeout: 5000 });
        });
      }
    })
  }

  signOffPlayer(player: Player) {
    this.tournamentService.signOffPlayer(this.tournament, player).subscribe(success => {
      if (success) {
        this.translateService.get('tournament.show.players.signoff.success', {}).subscribe((res: string) => {
          this.flashMessagesService.show(res, { classes: ['alert-success'], timeout: 5000 });
          this._loadPlayers()
        });
      } else {
        this.translateService.get('tournament.show.players.signoff.failure', {}).subscribe((res: string) => {
          this.flashMessagesService.show(res, { classes: ['alert-danger'], timeout: 5000 });
        });
      }
    })
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
