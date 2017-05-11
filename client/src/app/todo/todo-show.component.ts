import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Todo} from './todo';
import {TodoService} from './todo.service';

@Component({
  selector: 'todo-persist',
  templateUrl: './todo-show.component.html'
})
export class TodoShowComponent implements OnInit {

  todo = new Todo();

  constructor(private route: ActivatedRoute, private todoService: TodoService, private router: Router) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.todoService.get(+params['id']).subscribe((todo: Todo) => {
        this.todo = todo;
      });
    });
  }

  destroy() {
    if (confirm("Are you sure?")) {
      this.todoService.destroy(this.todo).subscribe((success: boolean) => {
        if (success) {
          this.router.navigate(['/todo','list']);
        } else {
          alert("Error occurred during delete");
        }
      });
    }
  }

}
