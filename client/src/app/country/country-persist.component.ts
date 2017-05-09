import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Country} from './country';
import {CountryService} from './country.service';
import {Response} from "@angular/http";


@Component({
  selector: 'country-persist',
  templateUrl: './country-persist.component.html'
})
export class CountryPersistComponent implements OnInit {

  country = new Country();
  create = true;
  errors: any[];
  

  constructor(private route: ActivatedRoute, private countryService: CountryService, private router: Router) {}

  ngOnInit() {
    
    this.route.params.subscribe((params: Params) => {
      if (params.hasOwnProperty('id')) {
        this.countryService.get(+params['id']).subscribe((country: Country) => {
          this.create = false;
          this.country = country;
        });
      }
    });
  }

  save() {
    this.countryService.save(this.country).subscribe((country: Country) => {
      this.router.navigate(['/country', 'show', country.id]);
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
