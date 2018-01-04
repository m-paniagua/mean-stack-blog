import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AuthGuard } from './guard/auth.guard';
import { NotAuthGuard } from './guard/notAuth.guard';
import { BlogComponent } from './components/blog/blog.component';
import { EditBlogComponent } from './components/blog/edit-blog/edit-blog.component';
import { DeleteBlogComponent } from './components/blog/delete-blog/delete-blog.component';

const appRoutes: Routes = [
  { 
    path: '', 
    component: HomeComponent, 
    pathMatch: 'full' 
  },    // default route
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [AuthGuard] 
  },         // dashboard route
  { 
    path: 'register', 
    component: RegisterComponent,
    canActivate: [NotAuthGuard] 
  },           // register route
  { 
    path: 'login', 
    component: LoginComponent,
    canActivate: [NotAuthGuard] 
  },                 // login route
  { 
    path: 'profile', 
    component: ProfileComponent,
    canActivate: [AuthGuard]     
  },             // profile route  
  { 
    path: 'blog', 
    component: BlogComponent,
    canActivate: [AuthGuard]         
  },             // blog route 
  { 
    path: 'edit-blog/:id', 
    component: EditBlogComponent,
    canActivate: [AuthGuard]         
  },
  { 
    path: 'delete-blog/:id', 
    component: DeleteBlogComponent,
    canActivate: [AuthGuard]         
  },     
  { 
    path: '**', 
    component: HomeComponent 
  }                      // redirect to home
];

@NgModule({
    declarations: [],
    imports: [RouterModule.forRoot(appRoutes)],
    providers: [],
    bootstrap: [],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }