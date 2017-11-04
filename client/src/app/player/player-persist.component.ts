import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Player} from './player';
import {PlayerService} from './player.service';
import {Response} from "@angular/http";
import { FederationService } from '../federation/federation.service';
import { Federation } from '../federation/federation';
import {AuthService} from "../services/auth.service";
import {ListResult} from "../helpers/list-result.interface";
import * as moment from 'moment';

@Component({
  selector: 'player-persist',
  templateUrl: './player-persist.component.html'
})
export class PlayerPersistComponent implements OnInit {

  player = new Player();
  create = true;
  errors: any[];
  federationList: Federation[];
  showFederationSelect:boolean;
  genderList: String[] = ["M", "F"];

  constructor(private route: ActivatedRoute,
              private playerService: PlayerService,
              private router: Router,
              private authService: AuthService,
              private federationService: FederationService) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      if (params.hasOwnProperty('id')) {
        this.playerService.get(+params['id']).subscribe((player: Player) => {
          this.create = false;
          this.player = player;
          if (this.authService.hasRole(["ROLE_SUPER_ADMIN", "ROLE_GENERAL_ADMIN"])) {
            this.showFederationSelect = true;
            this.federationService.list().subscribe((federationList: ListResult<Federation>) => {
              this.federationList = federationList.list;
              for (var i = 0; i < this.federationList.length; i++) {
                if (this.player.federation != null && this.federationList[i].id == this.player.federation.id) {
                  this.player.federation = this.federationList[i];
                  break;
                }
              }
            });
          }
        });
      }
    });
  }

  save() {
    console.log(this.player);
    this.playerService.save(this.player).subscribe((player: Player) => {
      this.router.navigate(['/player', 'show', player.id]);
    }, (res: Response) => {
      const json = res.json();
      if (json.hasOwnProperty('message')) {
        this.errors = [json];
      } else {
        this.errors = json._embedded.errors;
      }
    });
  }

  birthChanged(event: any) {
    // create the right date object for the birth
    try {
      this.player.birth = moment(event).toDate();
    } catch(e) {
      //console.log("fecha mala");
    }

  }
}
