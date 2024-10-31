import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { TodoService } from '../../services/todo.service';
import { ToastService } from '../../services/toast.service';
import { TokenService } from '../../services/token.service';
import { Todo } from '../../shared/interfaces/todo';
import { Messages } from 'src/app/shared/messages';
import { ApiError } from 'src/app/shared/interfaces/api-error';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  totalTask: number = 0;
  remainingTask: number = 0;
  completedTask: number = 0;
  todos: Todo[] = [];
  completedTodos: Todo[] = [];
  searchTerm: string = '';
  userName: string = 'User';
  page: number = 1;
  pageSize: number = 10;
  pageRemaining: number = 1;
  pageCompleted: number = 1;
  isTodoFormVisible: boolean = false;
  fadeDashboard: boolean = false;

  constructor(
    private router: Router,
    private userService: UserService,
    private todoService: TodoService,
    private toastService: ToastService,
    private tokenService: TokenService,
  ) {}

  ngOnInit(): void {
    this.loadTodos();
  }

  getUserDetailsFromToken() {
    this.userService.getUserDetails().subscribe(
      (data) => {
        this.userName = data.data.name;
        this.remainingTask = data.data.remainingCount;
        this.completedTask = data.data.completedCount;
        this.totalTask = this.remainingTask + this.completedTask;
      },
      () => {
        this.userName = 'User';
      }
    );
  }

  loadTodos() {
    this.todos = [];
    this.completedTodos = [];
    this.pageRemaining = 1;
    this.pageCompleted = 1;
    this.getUserDetailsFromToken();
    this.loadRemainingTodos();
    this.loadCompletedTodos();
  }

  onScroll() {
    this.page++;
    this.loadTodos();
  }

  loadRemainingTodos() {
    this.todoService.getTodos(this.pageRemaining, this.pageSize, false).subscribe(
      (data) => {
        this.todos = this.todos.concat(data.data);
      }
    );
  }

  onRemainingTodoScroll() {
    this.pageRemaining++;
    this.loadRemainingTodos();
  }

  loadCompletedTodos() {
    this.todoService.getTodos(this.pageCompleted, this.pageSize, true).subscribe(
      (data) => {
        this.completedTodos = this.completedTodos.concat(data.data);
      }
    );
  }

  onCompletedScroll() {
    this.pageCompleted++;
    this.loadCompletedTodos();
  }

  deleteTodo(todo: Todo): void {
    this.loadTodos();
  }

  filterTodos() {
    return this.todos.filter(todo =>
      todo.title.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  openTodoModal(todo: Todo) {
    console.log('Open modal for:', todo);
  }

  async addTodo(newTodo: Todo): Promise<void> {
    try {
      await this.todoService.addTodo(newTodo).toPromise();
      this.isTodoFormVisible = false;
      this.fadeDashboard = false;
      this.toastService.showSuccess(Messages.todo.createdSuccess);
      this.loadTodos();
    } catch (error: any) {
      let errorMsg: string = Messages.todo.creationFailed;

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

  openTodoForm() {
    this.isTodoFormVisible = true;
    this.fadeDashboard = true;
  }

  closeTodoForm() {
    this.isTodoFormVisible = false;
    this.fadeDashboard = false;
  }

  async handleTodoToggle(todo: Todo): Promise<void> {
    try {
      await this.todoService.updateTodo(todo).toPromise();
      this.toastService.showSuccess(Messages.todo.TaskCompleted);
      this.loadTodos();
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
      todo.checked = !todo.checked;
    }
  }

  logout() {
    this.tokenService.removeToken();
    this.router.navigate(['/login']);
  }
}
