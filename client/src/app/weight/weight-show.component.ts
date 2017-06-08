import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Weight} from './weight';
import {WeightService} from './weight.service';

@Component({
  selector: 'weight-persist',
  templateUrl: './weight-show.component.html'
})
export class WeightShowComponent implements OnInit {

  weight = new Weight();

  constructor(private route: ActivatedRoute, private weightService: WeightService, private router: Router) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.weightService.get(+params['id']).subscribe((weight: Weight) => {
        this.weight = weight;
      });
    });
  }

  destroy() {
    if (confirm("Are you sure?")) {
      this.weightService.destroy(this.weight).subscribe((success: boolean) => {
        if (success) {
          this.router.navigate(['/weight','list']);
        } else {
          alert("Error occurred during delete");
        }
      });
    }
  }

}
