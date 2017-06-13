import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Player} from './player';
import {PlayerService} from './player.service';

@Component({
  selector: 'player-persist',
  templateUrl: './player-show.component.html'
})
export class PlayerShowComponent implements OnInit {

  player = new Player();

  constructor(private route: ActivatedRoute, private playerService: PlayerService, private router: Router) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.playerService.get(+params['id']).subscribe((player: Player) => {
        this.player = player;
      });
    });
  }

  destroy() {
    if (confirm("Are you sure?")) {
      this.playerService.destroy(this.player).subscribe((success: boolean) => {
        if (success) {
          this.router.navigate(['/player','list']);
        } else {
          alert("Error occurred during delete");
        }
      });
    }
  }

}
