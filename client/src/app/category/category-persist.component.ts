import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Category} from './category';
import {CategoryService} from './category.service';
import {Response} from "@angular/http";


@Component({
  selector: 'category-persist',
  templateUrl: './category-persist.component.html'
})
export class CategoryPersistComponent implements OnInit {

  category = new Category();
  create = true;
  errors: any[];
  

  constructor(private route: ActivatedRoute, private categoryService: CategoryService, private router: Router) {}

  ngOnInit() {
    
    this.route.params.subscribe((params: Params) => {
      if (params.hasOwnProperty('id')) {
        this.categoryService.get(+params['id']).subscribe((category: Category) => {
          this.create = false;
          this.category = category;
        });
      }
    });
  }

  save() {
    this.categoryService.save(this.category).subscribe((category: Category) => {
      this.router.navigate(['/category', 'show', category.id]);
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
