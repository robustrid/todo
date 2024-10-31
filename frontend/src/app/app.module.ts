import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NetworkerrorComponent } from './components/others/networkerror/networkerror.component';
import { NotfoundComponent } from './components/others/notfound/notfound.component';
import { TodoFormComponent } from './components/todo/todoform/todoform.component';
import { TodoListComponent } from './components/todo/todolist/todolist.component';
import { ItemsComponent } from './components/todo/items/items.component';
import { LoginComponent } from './components/user/login/login.component';
import { SignupComponent } from './components/user/signup/signup.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';
import { DashboardComponent } from './components/dashboard/dashboard.component';

@NgModule({
  declarations: [
    AppComponent,
    NetworkerrorComponent,
    NotfoundComponent,
    DashboardComponent,
    TodoFormComponent,
    TodoListComponent,
    ItemsComponent,
    LoginComponent,
    SignupComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    ToastrModule.forRoot({
      timeOut: 5000,
      closeButton: false,
      progressBar: false,
      positionClass: 'toast-bottom-center',
      preventDuplicates: true,
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
