import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Weight} from './weight';
import {WeightService} from './weight.service';
import {Response} from "@angular/http";


@Component({
  selector: 'weight-persist',
  templateUrl: './weight-persist.component.html'
})
export class WeightPersistComponent implements OnInit {

  weight = new Weight();
  create = true;
  errors: any[];
  

  constructor(private route: ActivatedRoute, private weightService: WeightService, private router: Router) {}

  ngOnInit() {
    
    this.route.params.subscribe((params: Params) => {
      if (params.hasOwnProperty('id')) {
        this.weightService.get(+params['id']).subscribe((weight: Weight) => {
          this.create = false;
          this.weight = weight;
        });
      }
    });
  }

  save() {
    this.weightService.save(this.weight).subscribe((weight: Weight) => {
      this.router.navigate(['/weight', 'show', weight.id]);
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
