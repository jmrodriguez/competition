import {Component, OnInit} from '@angular/core';
import {PlayerService} from './player.service';
import {Player} from './player';

@Component({
  selector: 'player-list',
  templateUrl: './player-list.component.html'
})
export class PlayerListComponent implements OnInit {

  playerList: Player[] = [];

  constructor(private playerService: PlayerService) { }

  ngOnInit() {
    this.playerService.list().subscribe((playerList: Player[]) => {
      this.playerList = playerList;
    });
  }
}
