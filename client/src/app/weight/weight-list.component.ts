import {Component, OnInit} from '@angular/core';
import {WeightService} from './weight.service';
import {Weight} from './weight';

@Component({
  selector: 'weight-list',
  templateUrl: './weight-list.component.html'
})
export class WeightListComponent implements OnInit {

  weightList: Weight[] = [];

  constructor(private weightService: WeightService) { }

  ngOnInit() {
    this.weightService.list().subscribe((weightList: Weight[]) => {
      this.weightList = weightList;
    });
  }
}
