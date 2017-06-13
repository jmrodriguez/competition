import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Player} from './player';
import {PlayerService} from './player.service';
import {Response} from "@angular/http";
import { FederationService } from '../federation/federation.service';
import { Federation } from '../federation/federation';

@Component({
  selector: 'player-persist',
  templateUrl: './player-persist.component.html'
})
export class PlayerPersistComponent implements OnInit {

  player = new Player();
  create = true;
  errors: any[];
  federationList: Federation[];

  constructor(private route: ActivatedRoute, private playerService: PlayerService, private router: Router, private federationService: FederationService) {}

  ngOnInit() {
    this.federationService.list().subscribe((federationList: Federation[]) => { this.federationList = federationList; });
    this.route.params.subscribe((params: Params) => {
      if (params.hasOwnProperty('id')) {
        this.playerService.get(+params['id']).subscribe((player: Player) => {
          this.create = false;
          this.player = player;
        });
      }
    });
  }

  save() {
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
}
