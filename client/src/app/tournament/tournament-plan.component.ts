import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Tournament} from './tournament';
import {TournamentService} from './tournament.service';
import {Observable} from "rxjs/Observable";
import {GroupService} from "../group/group.service";
import {Group} from "../group/group";
import {ListResult} from "../helpers/list-result.interface";

@Component({
  selector: 'tournament-plan',
  templateUrl: './tournament-plan.component.html'
})
export class TournamentPlanComponent implements OnInit {

  tournament = new Tournament();
  total: Observable<number>;
  groups: Observable<Group[]>;
  groupsAvailable: boolean;

  constructor(private route: ActivatedRoute,
              private tournamentService: TournamentService,
              private groupService: GroupService,
              private router: Router) {}

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

    this.groupService.list(this.tournament).subscribe((listResult: ListResult<Group>) => {
      this.total = Observable.of(listResult.total);
      this.groups = Observable.of(listResult.items);
      this.groupsAvailable = listResult.total > 0;
      console.log(listResult);
      console.log("Loaded tournament groups");
    });

  }

  generateGroups() {
    this.groupService.generateGroups(this.tournament.id).subscribe((listResult: ListResult<Group>) => {
      this.total = Observable.of(listResult.total);
      this.groups = Observable.of(listResult.items);
      this.groupsAvailable = listResult.total > 0;
      console.log("Created tournament groups");
    });
  }

  generateDraw() {
    this.tournamentService.generateDraw(this.tournament.id).subscribe((tournament: Tournament) => {
      this.tournament = tournament
    })
  }
}
