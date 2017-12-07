import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';

const appRoutes: Routes = [
  
  { path: '', component: HomeComponent, pathMatch: 'full' },    // default route
  { path: 'dashboard', component: DashboardComponent },         // dashboard route
  { path: 'register', component: RegisterComponent },           // register route
  { path: 'login', component: LoginComponent },                 // login route
  { path: '**', component: HomeComponent }                      // redirect to home
];

@NgModule({
    declarations: [],
    imports: [RouterModule.forRoot(appRoutes)],
    providers: [],
    bootstrap: [],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }