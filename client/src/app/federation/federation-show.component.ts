import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Federation} from './federation';
import {FederationService} from './federation.service';

@Component({
  selector: 'federation-persist',
  templateUrl: './federation-show.component.html'
})
export class FederationShowComponent implements OnInit {

  federation = new Federation();

  constructor(private route: ActivatedRoute, private federationService: FederationService, private router: Router) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.federationService.get(+params['id']).subscribe((federation: Federation) => {
        this.federation = federation;
      });
    });
  }

  destroy() {
    if (confirm("Are you sure?")) {
      this.federationService.destroy(this.federation).subscribe((success: boolean) => {
        if (success) {
          this.router.navigate(['/federation','list']);
        } else {
          alert("Error occurred during delete");
        }
      });
    }
  }

}
