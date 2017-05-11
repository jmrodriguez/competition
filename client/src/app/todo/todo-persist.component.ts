import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Todo} from './todo';
import {TodoService} from './todo.service';
import {Response} from "@angular/http";


@Component({
  selector: 'todo-persist',
  templateUrl: './todo-persist.component.html'
})
export class TodoPersistComponent implements OnInit {

  todo = new Todo();
  create = true;
  errors: any[];
  

  constructor(private route: ActivatedRoute, private todoService: TodoService, private router: Router) {}

  ngOnInit() {
    
    this.route.params.subscribe((params: Params) => {
      if (params.hasOwnProperty('id')) {
        this.todoService.get(+params['id']).subscribe((todo: Todo) => {
          this.create = false;
          this.todo = todo;
        });
      }
    });
  }

  save() {
    this.todoService.save(this.todo).subscribe((todo: Todo) => {
      this.router.navigate(['/todo', 'show', todo.id]);
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
