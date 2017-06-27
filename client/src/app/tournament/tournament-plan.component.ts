import {Component, OnInit, QueryList, ViewChildren} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {Tournament} from './tournament';
import {TournamentService} from './tournament.service';
import {Observable} from "rxjs/Observable";
import {TournamentGroupService} from "../tournamentGroup/tournamentGroup.service";
import {ListResult} from "../helpers/list-result.interface";
import {TournamentGroup} from "../tournamentGroup/tournamentGroup";
import {MdTab} from '@angular/material';

@Component({
  selector: 'tournament-plan',
  templateUrl: './tournament-plan.component.html'
})
export class TournamentPlanComponent implements OnInit {

  @ViewChildren(MdTab) mdTabList: QueryList<MdTab>;

  tournament = new Tournament();
  total: Observable<number>;
  tournamentGroups: Observable<TournamentGroup[]>;
  groupsAvailable: boolean;

  constructor(private route: ActivatedRoute,
              private tournamentService: TournamentService,
              private tournamentGroupService: TournamentGroupService,
              private router: Router,
              private translateService: TranslateService) {}

  ngOnInit() {
    this.groupsAvailable = false;
    this.route.params.subscribe((params: Params) => {
      if (params.hasOwnProperty('id')) {
        this.tournamentService.get(+params['id']).subscribe((tournament: Tournament) => {
          this.tournament = tournament;
          this._loadGroups();
        });
      } else {
        this.router.navigate(['/index']);
      }
    });
  }

  private _loadGroups():void {

    console.log("Loading tournament groups");

    const source = this.tournamentGroupService.list(this.tournament).share();

    this.total = source.pluck('total');
    this.tournamentGroups = source.pluck('list');

    this.tournamentGroups.subscribe((groupsList: TournamentGroup[]) => {
      this.groupsAvailable = groupsList.length > 0;
      console.log("Loaded tournament groups");
    });

  }

  generateGroups() {
    console.log("Creating tournament groups");
    const source = this.tournamentGroupService.generateGroups(this.tournament.id).share();
    this.total = source.pluck('total');
    this.tournamentGroups = source.pluck('list');

    this.tournamentGroups.subscribe((groupsList: TournamentGroup[]) => {
      this.groupsAvailable = groupsList.length > 0;
      console.log("Created tournament groups");
    });
  }

  generateDraw() {
    this.tournamentService.generateDraw(this.tournament.id).subscribe((tournament: Tournament) => {
      this.tournament = tournament
    })
  }

  viewContent(event: any) {

    // the selected tab is the final bracket tab
    if (this.mdTabList.last == event.tab) {

    } else {

    }
  }
}
