import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule, Routes } from '@angular/router';
import {MatTableModule} from '@angular/material/table';



import {
  MatCardModule,
  MatButtonModule,
  MatToolbarModule,
  MatGridListModule,
  MatDividerModule,
  MatTabsModule,
  MatInputModule,
  MatExpansionModule,
  MatTooltipModule,
  MatProgressSpinnerModule,
  MatListModule,
  MatIconModule,
  MatMenuModule,
  MatButtonToggleModule,
  MatDialogModule
  } from '@angular/material';
import { IdeComponent } from './ide/ide.component';
import { LabPageComponent } from './labs/lab-page/lab-page.component';
import { LabDescComponent } from './labs/lab-desc/lab-desc.component';
import { HeaderComponent } from './header/header.component';
import { ConsoleComponent } from './ide/console/console.component';
import { ClassroomComponent } from './classroom/classroom.component';
import { LabEditorComponent } from './labs/lab-editor/lab-editor.component';
import { AppRoutingModule } from './app-routing.module';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AuthInterceptor } from './auth/auth-interceptor';
import { CodeComponent } from './code/code.component';
import { AboutComponent } from './about/about.component';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { JoinCreateComponent } from './classroom/join-create/join-create.component';
import { HomeComponent } from './home/home.component';
import { LabGradeViewComponent } from './classroom/lab-grade-view/lab-grade-view.component';
import { ErrorInterceptor } from './error-interceptor';
import { ErrComponent } from './err/err.component';

@NgModule({
  declarations: [
    AppComponent,
    IdeComponent,
    LabPageComponent,
    LabDescComponent,
    HeaderComponent,
    ConsoleComponent,
    ClassroomComponent,
    LabEditorComponent,
    LoginComponent,
    SignupComponent,
    CodeComponent,
    AboutComponent,
    JoinCreateComponent,
    HomeComponent,
    LabGradeViewComponent,
    ErrComponent,

  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatToolbarModule,
    MatButtonModule,
    MatGridListModule,
    MatDividerModule,
    MatTabsModule,
    MatInputModule,
    MatExpansionModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatListModule,
    MatIconModule,
    MatMenuModule,
    MatButtonToggleModule,
    MatSnackBarModule,
    HttpClientModule,
    FlexLayoutModule,
    MatTableModule,
    MatDialogModule
  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
