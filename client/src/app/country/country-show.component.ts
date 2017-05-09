import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Country} from './country';
import {CountryService} from './country.service';

@Component({
  selector: 'country-persist',
  templateUrl: './country-show.component.html'
})
export class CountryShowComponent implements OnInit {

  country = new Country();

  constructor(private route: ActivatedRoute, private countryService: CountryService, private router: Router) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.countryService.get(+params['id']).subscribe((country: Country) => {
        this.country = country;
      });
    });
  }

  destroy() {
    if (confirm("Are you sure?")) {
      this.countryService.destroy(this.country).subscribe((success: boolean) => {
        if (success) {
          this.router.navigate(['/country','list']);
        } else {
          alert("Error occurred during delete");
        }
      });
    }
  }

}
