import { Component, EventEmitter, Input, Output, OnChanges } from '@angular/core';
import { Todo } from '../../../shared/interfaces/todo';

@Component({
  selector: 'app-todo-form',
  templateUrl: './todoform.component.html',
  styleUrls: ['./todoform.component.scss'],
})
export class TodoFormComponent implements OnChanges {
  @Input() todo?: Todo;
  @Output() todoAdded = new EventEmitter<Todo>();
  @Output() close = new EventEmitter<void>();

  title: string = '';
  taskDesc: string = '';

  ngOnChanges() {
    if (this.todo) {
      this.title = this.todo.title;
      this.taskDesc = this.todo.taskDesc;
    } else {
      this.resetForm();
    }
  }

  onSave() {
    const newTodo: Todo = {
      userId: this.todo ? this.todo.userId : 1,
      title: this.title,
      taskDesc: this.taskDesc,
      checked: false,
    };
    this.todoAdded.emit(newTodo);
    this.resetForm();
  }

  private resetForm() {
    this.title = '';
    this.taskDesc = '';
  }

  onClose() {
    this.close.emit();
  }
}
