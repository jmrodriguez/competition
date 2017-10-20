import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {PointsRange} from './pointsRange';
import {PointsRangeService} from './pointsRange.service';
import {Response} from "@angular/http";
import { FederationService } from '../federation/federation.service';
import { Federation } from '../federation/federation';
import {AuthService} from "../services/auth.service";
import {ListResult} from "../helpers/list-result.interface";

@Component({
  selector: 'pointsRange-persist',
  templateUrl: './pointsRange-persist.component.html'
})
export class PointsRangePersistComponent implements OnInit {

  pointsRange = new PointsRange();
  create = true;
  errors: any[];
  federationList: Federation[];
  showFederationSelect:boolean;

  constructor(private route: ActivatedRoute,
              private pointsRangeService: PointsRangeService,
              private router: Router,
              private federationService: FederationService,
              private authService: AuthService) {}

  ngOnInit() {
    this.showFederationSelect = this.authService.hasRole(["ROLE_SUPER_ADMIN", "ROLE_GENERAL_ADMIN"]);

    this.route.params.subscribe((params: Params) => {
      if (params.hasOwnProperty('id')) {
        this.pointsRangeService.get(+params['id']).subscribe((pointsRange: PointsRange) => {
          this.create = false;
          this.pointsRange = pointsRange;

          if (this.showFederationSelect) {
            this.federationService.list().subscribe((federationList: ListResult<Federation>) => {
              this.federationList = federationList.list;
              for (var i = 0; i < this.federationList.length; i++) {
                if (this.federationList[i].id == this.pointsRange.federation.id) {
                  this.pointsRange.federation = this.federationList[i];
                  break;
                }
              }
            });
          }
        });
      } else {
        if (this.showFederationSelect) {
          this.federationService.list().subscribe((federationList: ListResult<Federation>) => {
            this.federationList = federationList.list;
          });
        }

      }
    });
  }

  save() {
    this.pointsRangeService.save(this.pointsRange).subscribe((pointsRange: PointsRange) => {
      this.router.navigate(['/pointsRange', 'show', pointsRange.id]);
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
