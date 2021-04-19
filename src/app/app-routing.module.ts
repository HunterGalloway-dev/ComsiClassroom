import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ClassroomComponent } from './classroom/classroom.component';
import { AppComponent } from './app.component';
import { LabDescComponent } from './labs/lab-desc/lab-desc.component';
import { LabEditorComponent } from './labs/lab-editor/lab-editor.component';
import { LabPageComponent } from './labs/lab-page/lab-page.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AuthGuard } from './auth/auth.guard';
import { AboutComponent } from './about/about.component';
import { CodeComponent  } from './code/code.component';
import { JoinCreateComponent } from './classroom/join-create/join-create.component';
import { HomeComponent } from './home/home.component';
import { LabGradeViewComponent } from './classroom/lab-grade-view/lab-grade-view.component';

/*
  Routing gives angular the ability show specefic javascript objects
  for certian URLs

  THIS DOES NOT CHANGE THE PAGE

  Angular simply loads every component upon initialization, and then
  decides which components to render at a given moment, angular never switches pages

  The links you use here can NOT conflict with the paths defined here

  ex.
    if you have a api path such as /create/posts
    you can not have a path here that is /create

  This routes variables gives angular the ability to see what components should be displayed
  depending on what link is currently being accessed
*/
const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'signup',
    component: SignupComponent
  },
  {
    path: '',
    component: ClassroomComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'create',
    component: LabEditorComponent,
    canActivate: [AuthGuard],
  },
  /*
    Adding a colon to this aligns for dynamic routing, basically it sends
    data to the page upon rendering
  */
  {
    path: 'edit/:labId',
    component: LabEditorComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'lab/:labId',
    component: LabPageComponent,
    canActivate: [AuthGuard],
  },
  {
    path:'about',
    component: AboutComponent
  },
  {
    path: 'code',
    component: CodeComponent
  },
  {
    path: 'classroom-options',
    component: JoinCreateComponent
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'lab-grade-view/:labId',
    component: LabGradeViewComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard],
})

export class AppRoutingModule {}
