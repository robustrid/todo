import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Todo } from '../../../shared/interfaces/todo';
import { TodoService } from '../../../services/todo.service';
import { ToastService } from '../../../services/toast.service';
import { ApiError } from 'src/app/shared/interfaces/api-error';
import { Messages } from 'src/app/shared/messages';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todolist.component.html',
  styleUrls: ['./todolist.component.scss'],
})
export class TodoListComponent {
  @Input() todos: Todo[] = [];
  @Output() scroll = new EventEmitter<void>();
  @Output() todoToggled = new EventEmitter<Todo>();
  @Output() todoClicked = new EventEmitter<Todo>();
  @Output() todoDeleted = new EventEmitter<Todo>();

  constructor(
    private todoService: TodoService,
    private toastService: ToastService,
  ) {}

  onScroll() {
    this.scroll.emit();
  }

  onTodoClick(todo: Todo) {
    this.todoClicked.emit(todo);
  }

  toggleTodoCompletion(todo: Todo) {
    todo.checked = !todo.checked;
    this.todoToggled.emit(todo);
  }

  deleteTodo(todo: Todo) {
    todo.isDeleted = true;
    this.todoService.updateTodo(todo).subscribe(() => {
      this.todoDeleted.emit(todo);
    });
  }

  startEditing(todo: Todo) {
    todo.isEditing = true;
  }

  async stopEditing(todo: Todo) {
    todo.isEditing = false;
    try {
      if (!todo.title.trim()) {
        this.toastService.showError('Title cannot be empty.');
        return;
      }
      this.todoService.updateTodo(todo).subscribe(() => {
        this.toastService.showSuccess(Messages.todo.TaskUpdated);
      })
    } catch (error: any) {
      let errorMsg: string = Messages.todo.updateFailed;

      if (error?.error) {
        const apiError: ApiError = error.error;
        errorMsg = apiError.message;
        if (apiError.details) {
          errorMsg += `: ${apiError.details}`;
        }
      }

      this.toastService.showError(errorMsg);
    }
  }
}
