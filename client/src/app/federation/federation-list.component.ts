import {Component, OnInit} from '@angular/core';
import {FederationService} from './federation.service';
import {Federation} from './federation';

@Component({
  selector: 'federation-list',
  templateUrl: './federation-list.component.html'
})
export class FederationListComponent implements OnInit {

  federationList: Federation[] = [];

  constructor(private federationService: FederationService) { }

  ngOnInit() {
    this.federationService.list().subscribe((federationList: Federation[]) => {
      this.federationList = federationList;
    });
  }
}
