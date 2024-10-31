import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotfoundComponent } from './components/others/notfound/notfound.component';
import { LoginComponent } from './components/user/login/login.component';
import { SignupComponent } from './components/user/signup/signup.component';
import { NetworkerrorComponent } from './components/others/networkerror/networkerror.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

const routes: Routes = [
  {path:'', redirectTo:'login',pathMatch:'full'},
  {path:'login',component:LoginComponent},
  {path:'signuup',component:SignupComponent},
  { path: 'dashboard', component: DashboardComponent },
  {path:'network-error', component:NetworkerrorComponent},
  {path:'**', redirectTo:'login',pathMatch:'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
