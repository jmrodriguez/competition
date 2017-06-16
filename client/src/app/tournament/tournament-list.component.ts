import {Component, OnInit} from '@angular/core';
import {TournamentService} from './tournament.service';
import {Tournament} from './tournament';
import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Subject";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'tournament-list',
  templateUrl: './tournament-list.component.html'
})
export class TournamentListComponent implements OnInit {

  private sub: any;
  total: Observable<number>;
  tournaments: Observable<Tournament[]>;

  page: number = 1;
  terms: string = "";

  private searchTermStream = new Subject<string>();
  private pageStream = new Subject<number>();

  constructor(private route: ActivatedRoute,
              private tournamentService: TournamentService) {
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
    this._loadData();
  }

  private _loadData():void {
    const pageSource = this.pageStream.map(pageNumber => {
      this.page = pageNumber;
      return {search: this.terms, page: pageNumber}
    });

    const searchSource = this.searchTermStream
        .debounceTime(1000)
        .distinctUntilChanged()
        .map(searchTerm => {
          this.terms = searchTerm;
          return {search: searchTerm, page: 1}
        });

    const source = pageSource
        .merge(searchSource)
        .startWith({search: this.terms, page: this.page})
        .mergeMap((params: {search: string, page: number}) => {
          return this.tournamentService.list(params.search, params.page)
        })
        .share();

    this.total = source.pluck('total');
    this.tournaments = source.pluck('list');
  }

  search(terms: string) {
    this.searchTermStream.next(terms)
  }

  goToPage(page: number) {
    this.pageStream.next(page)
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
