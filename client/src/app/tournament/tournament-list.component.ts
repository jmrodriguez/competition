import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {TournamentService} from './tournament.service';
import {Subject} from "rxjs/Subject";
import {ActivatedRoute} from "@angular/router";
import {MatPaginator, MatSort} from "@angular/material";
import {TournamentDataSource} from "./tournament.datasource";
import {AuthService} from '../services/auth.service';

@Component({
  selector: 'tournament-list',
  templateUrl: './tournament-list.component.html'
})
export class TournamentListComponent implements OnInit {

  displayedColumns = ['id', 'name', 'date', 'weight', 'genderRestricted', 'gender', 'federation', 'bestOf', 'groupsOf', 'includeGroupPhase', 'category', 'pointsRange'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  @Input() terms = "";

  tournamentDatasource: TournamentDataSource | null;

  private searchTermStream = new Subject<string>();
  private initStream = new Subject<boolean>();

  constructor(private route: ActivatedRoute,
              public authService: AuthService,
              private tournamentService: TournamentService) {
  }

  ngOnInit() {
    this.tournamentDatasource = new TournamentDataSource(this.searchTermStream, this.paginator, this.sort, this.tournamentService, this.initStream);
    // listen to datasource connection to trigger initial search
    this.tournamentDatasource.connectionNotifier.subscribe((connected: boolean) => {
      if (connected) {
        // TRIGGER THE INITIAL SEARCH. We could use any subject for this purpose
        // XXX: not sure why but if we don't use a timeout here, even with time 0, the event is not triggered
        setTimeout (() => {
          this.initStream.next(true);
        }, 0);
      }
    });
  }

  search(value:string) {
    this.terms = value;
    this.searchTermStream.next(this.terms);
  }

  clearFilterText() {
    this.terms = "";
    this.search(this.terms);
  }
}
