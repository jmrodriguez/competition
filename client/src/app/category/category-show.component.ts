import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Category} from './category';
import {CategoryService} from './category.service';

@Component({
  selector: 'category-persist',
  templateUrl: './category-show.component.html'
})
export class CategoryShowComponent implements OnInit {

  category = new Category();

  constructor(private route: ActivatedRoute, private categoryService: CategoryService, private router: Router) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.categoryService.get(+params['id']).subscribe((category: Category) => {
        this.category = category;
      });
    });
  }

  destroy() {
    if (confirm("Are you sure?")) {
      this.categoryService.destroy(this.category).subscribe((success: boolean) => {
        if (success) {
          this.router.navigate(['/category','list']);
        } else {
          alert("Error occurred during delete");
        }
      });
    }
  }

}
