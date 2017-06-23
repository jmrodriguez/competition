import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {TournamentCategory} from './tournamentCategory';
import {TournamentCategoryService} from './tournamentCategory.service';
import {Response} from "@angular/http";

@Component({
  selector: 'tournamentCategory-persist',
  templateUrl: './tournamentCategory-persist.component.html'
})
export class TournamentCategoryPersistComponent implements OnInit {

  tournamentCategory = new TournamentCategory();
  create = true;
  errors: any[];

  constructor(private route: ActivatedRoute,
              private tournamentCategoryService: TournamentCategoryService,
              private router: Router) {}

  ngOnInit() {
    this.tournamentCategory.includeGroupPhase = true;
    this.tournamentCategory.bestOf = 3;
    this.tournamentCategory.groupsOf = 3;
    this.route.params.subscribe((params: Params) => {
      if (params.hasOwnProperty('tournamentId'), params.hasOwnProperty('categoryId')) {
        this.tournamentCategoryService.get(+params['tournamentId'], +params['categoryId']).subscribe((tournamentCategory: TournamentCategory) => {
          this.create = false;
          this.tournamentCategory = tournamentCategory;
        });
      }
    });
  }

  save() {
    this.tournamentCategoryService.save(this.tournamentCategory).subscribe((tournamentCategory: TournamentCategory) => {
      this.router.navigate(['/tournamentCategory', 'show', tournamentCategory.id]);
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
