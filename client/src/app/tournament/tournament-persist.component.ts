import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Tournament} from './tournament';
import {TournamentService} from './tournament.service';
import {Response} from "@angular/http";
import { WeightService } from '../weight/weight.service';
import { Weight } from '../weight/weight';
import { FederationService } from '../federation/federation.service';
import { Federation } from '../federation/federation';
import {AuthService} from "../services/auth.service";
import {CategoryService} from "../category/category.service";
import {Category} from "../category/category";
import {ListResult} from "../helpers/list-result.interface";
import * as moment from 'moment';
import {PointsRangeService} from "../pointsRange/pointsRange.service";
import {PointsRange} from "../pointsRange/pointsRange";

@Component({
  selector: 'tournament-persist',
  templateUrl: './tournament-persist.component.html'
})
export class TournamentPersistComponent implements OnInit {

  tournament = new Tournament();
  create = true;
  errors: any[];
  weightList: Weight[];
  federationList: Federation[];
  categoryList: Category[];
  pointsRangeList : PointsRange[];
  showFederationSelect:boolean;
  genderList: String[] = ["M", "F"];

  constructor(private route: ActivatedRoute,
              private tournamentService: TournamentService,
              private router: Router,
              private weightService: WeightService,
              private federationService: FederationService,
              private categoryService: CategoryService,
              private pointsRangeService: PointsRangeService,
              private authService: AuthService) {}

  ngOnInit() {
    this.showFederationSelect = this.authService.hasRole(["ROLE_SUPER_ADMIN", "ROLE_GENERAL_ADMIN"]);
    this.tournament.genderRestricted = false;
    this.tournament.includeGroupPhase = true;
    this.tournament.bestOf = 3;
    this.tournament.groupsOf = 3;

    this.route.params.subscribe((params: Params) => {
      if (params.hasOwnProperty('id')) {
        this.tournamentService.get(+params['id']).subscribe((tournament: Tournament) => {
          this.create = false;
          this.tournament = tournament;
          // change the tournament weight and federation to use LITERALLY the exact object from the respective list,
          // otherwise the value in the select box is selected but not visible
          this.weightService.list().subscribe((weightList: ListResult<Weight>) => {
            this.weightList = weightList.list;
            for (var i = 0; i < this.weightList.length; i++) {
              if (this.weightList[i].id == this.tournament.weight.id) {
                  this.tournament.weight = this.weightList[i];
                  break;
              }
            }
          });

          this.categoryService.list().subscribe((categoryList: ListResult<Category>) => {
            this.categoryList = categoryList.list;
            for (var i = 0; i < this.categoryList.length; i++) {
              if (this.categoryList[i].id == this.tournament.category.id) {
                this.tournament.category = this.categoryList[i];
                break;
              }
            }
          });

          this.pointsRangeService.list().subscribe((pointsRangeList: ListResult<PointsRange>) => {
            this.pointsRangeList = pointsRangeList.list;
            for (var i = 0; i < this.pointsRangeList.length; i++) {
              if (this.tournament.pointsRange != null && this.pointsRangeList[i].id == this.tournament.pointsRange.id) {
                this.tournament.pointsRange = this.pointsRangeList[i];
                break;
              }
            }
          });

          if (this.showFederationSelect) {
            this.federationService.list().subscribe((federationList: ListResult<Federation>) => {
              this.federationList = federationList.list;
              for (var i = 0; i < this.federationList.length; i++) {
                if (this.federationList[i].id == this.tournament.federation.id) {
                  this.tournament.federation = this.federationList[i];
                  break;
                }
              }
            });
          }
        });
      } else {
        // load the list and set default values
        this.weightService.list().subscribe((weightList: ListResult<Weight>) => {
          this.weightList = weightList.list;
          this.tournament.weight = this.weightList[0];
        });

        this.categoryService.list().subscribe((categoryList: ListResult<Category>) => {
          this.categoryList = categoryList.list;
          this.tournament.category = this.categoryList[0];
        });

        this.pointsRangeService.list().subscribe((pointsRangeList: ListResult<PointsRange>) => {
          this.pointsRangeList = pointsRangeList.list;
        });

        if (this.showFederationSelect) {
          this.federationService.list().subscribe((federationList: ListResult<Federation>) => {
            this.federationList = federationList.list;
          });
        }

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

  dateChanged(event: any) {
    // create the right date object for the birth
    try {
      this.tournament.date = moment(event).toDate();
    } catch(e) {
      //console.log("fecha mala");
    }

  }
}
