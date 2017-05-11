import {Component, OnInit} from '@angular/core';
import {TodoService} from './todo.service';
import {Todo} from './todo';

@Component({
  selector: 'todo-list',
  templateUrl: './todo-list.component.html'
})
export class TodoListComponent implements OnInit {

  todoList: Todo[] = [];

  constructor(private todoService: TodoService) { }

  ngOnInit() {
    this.todoService.list().subscribe((todoList: Todo[]) => {
      this.todoList = todoList;
    });
  }
}
