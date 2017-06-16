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

  constructor(private route: ActivatedRoute,
              private tournamentService: TournamentService,
              private router: Router,
              private weightService: WeightService,
              private federationService: FederationService,
              private authService: AuthService) {}

  ngOnInit() {
    this.tournament.genderRestricted = false;
    this.route.params.subscribe((params: Params) => {
      if (params.hasOwnProperty('id')) {
        this.tournamentService.get(+params['id']).subscribe((tournament: Tournament) => {
          this.create = false;
          this.tournament = tournament;
          // change the tournament weight and federation to use LITERALLY the exact object from the respective list,
          // otherwise the value in the select box is selected but not visible
          this.weightService.list().subscribe((weightList: Weight[]) => {
            this.weightList = weightList;
            for (var i = 0; i < this.weightList.length; i++) {
              if (this.weightList[i].id == this.tournament.weight.id) {
                  this.tournament.weight = this.weightList[i];
                  break;
              }
            }
          });

          this.federationService.list().subscribe((federationList: Federation[]) => {
            this.federationList = federationList;
            for (var i = 0; i < this.federationList.length; i++) {
              if (this.federationList[i].id == this.tournament.federation.id) {
                this.tournament.federation = this.federationList[i];
                break;
              }
            }
          });
        });
      } else {
        // load the list and set default values
        this.weightService.list().subscribe((weightList: Weight[]) => {
          this.weightList = weightList;
          this.tournament.weight = this.weightList[0];
        });

        this.federationService.list().subscribe((federationList: Federation[]) => {
          this.federationList = federationList;
          if (this.authService.hasRole(["ROLE_FEDERATION_ADMIN"])) {
            this.tournament.federation = this.federationList[0];
          }
        });
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
}
