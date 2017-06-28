import {Component, OnInit, QueryList, ViewChildren} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {Tournament} from './tournament';
import {TournamentService} from './tournament.service';
import {Observable} from "rxjs/Observable";
import {TournamentGroupService} from "../tournamentGroup/tournamentGroup.service";
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
  matchOrder:number[][];

  selectedTab: number;

  selectedGroup: TournamentGroup;

  constructor(private route: ActivatedRoute,
              private tournamentService: TournamentService,
              private tournamentGroupService: TournamentGroupService,
              private router: Router,
              private translateService: TranslateService) {}

  ngOnInit() {
    this.groupsAvailable = false;
    this.selectedTab = 0;
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
      if (this.groupsAvailable) {
        this.selectedGroup = groupsList[0];
        this._getMatchOrder();
      }
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
      if (this.groupsAvailable) {
        this.selectedGroup = groupsList[0];
        this._getMatchOrder();
      }
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
      this.selectedGroup = null;
    } else {
      this.tournamentGroups.subscribe((groupsList: TournamentGroup[]) => {
        this.selectedGroup = groupsList[event.index];
      });
    }
  }

  _getMatchOrder() {
    var groupsOf = 3;
    if (this.tournament != null) {
      groupsOf = this.tournament.groupsOf;
    }

    var matchOrder = [[1,3], [1,2], [2,3]];
    switch(groupsOf) {
      case 3:
        matchOrder = [[1,3], [1,2], [2,3]];
        break;
      case 4:
        matchOrder = [[1,3], [4,2], [1,2], [3,4], [1,4], [2,3]];
        break;
      case 5:
        matchOrder = [[1,4], [5,3], [1,3], [4,2], [1,2], [4,5], [2,5], [3,4], [1,5], [2,3]];
        break;
    }

    this.matchOrder = matchOrder;
  }
}
