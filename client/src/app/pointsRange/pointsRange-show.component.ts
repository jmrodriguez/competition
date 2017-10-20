import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {PointsRange} from './pointsRange';
import {PointsRangeService} from './pointsRange.service';

@Component({
  selector: 'pointsRange-persist',
  templateUrl: './pointsRange-show.component.html'
})
export class PointsRangeShowComponent implements OnInit {

  pointsRange = new PointsRange();

  constructor(private route: ActivatedRoute,
              private pointsRangeService: PointsRangeService,
              private router: Router) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.pointsRangeService.get(+params['id']).subscribe((pointsRange: PointsRange) => {
        this.pointsRange = pointsRange;
      });
    });
  }

  destroy() {
    if (confirm("Are you sure?")) {
      this.pointsRangeService.destroy(this.pointsRange).subscribe((success: boolean) => {
        if (success) {
          this.router.navigate(['/pointsRange','list']);
        } else {
          alert("Error occurred during delete");
        }
      });
    }
  }

}
