import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Federation} from './federation';
import {FederationService} from './federation.service';
import {Response} from "@angular/http";
import { CountryService } from '../country/country.service';
import { Country } from '../country/country';
import {ListResult} from "../helpers/list-result.interface";

@Component({
  selector: 'federation-persist',
  templateUrl: './federation-persist.component.html'
})
export class FederationPersistComponent implements OnInit {

  federation = new Federation();
  create = true;
  errors: any[];
  countryList: Country[];

  constructor(private route: ActivatedRoute, private federationService: FederationService, private router: Router, private countryService: CountryService) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      if (params.hasOwnProperty('id')) {
        this.federationService.get(+params['id']).subscribe((federation: Federation) => {
          this.create = false;
          this.federation = federation;
          this.countryService.list().subscribe((countryList: ListResult<Country>) => {
            this.countryList = countryList.list;
            for (var i = 0; i < this.countryList.length; i++) {
              if (this.countryList[i].id == this.federation.country.id) {
                this.federation.country = this.countryList[i];
              }
            }
          });
        });
      } else {
        this.countryService.list().subscribe((countryList: ListResult<Country>) => {
          this.countryList = countryList.list;
          this.federation.country = this.countryList[0];
        });
      }
    });

  }

  save() {
    this.federationService.save(this.federation).subscribe((federation: Federation) => {
      this.router.navigate(['/federation', 'show', federation.id]);
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
