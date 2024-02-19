// angular
import { Routes } from '@angular/router';
// components
import { LayoutComponent } from './shared/components/layout/layout.component';
import { LoginComponent } from './auth/components/login/login.component';
import { RegisterComponent } from './auth/components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { CreatePostComponent } from './components/create-post/create-post.component';
import { DetailPostComponent } from './components/detail-post/detail-post.component';
import { UpdatePostComponent } from './components/update-post/update-post.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: HomeComponent,
      },
      {
        path: 'post/:id',
        component: DetailPostComponent,
      },
      {
        path: 'create-post',
        component: CreatePostComponent,
      },
      {
        path: 'update-post/:id',
        component: UpdatePostComponent,
      }
    ],
  },
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'register',
        component: RegisterComponent,
      },
    ],
  },
];
