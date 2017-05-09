import {Component, OnInit} from '@angular/core';
import {CountryService} from './country.service';
import {Country} from './country';

@Component({
  selector: 'country-list',
  templateUrl: './country-list.component.html'
})
export class CountryListComponent implements OnInit {

  countryList: Country[] = [];

  constructor(private countryService: CountryService) { }

  ngOnInit() {
    this.countryService.list().subscribe((countryList: Country[]) => {
      this.countryList = countryList;
    });
  }
}
