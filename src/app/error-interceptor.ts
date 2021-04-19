import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { AuthService } from './auth/auth.service';
import { Injectable } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { ErrComponent } from './err/err.component';
import { LoginComponent } from './auth/login/login.component';

@Injectable()
export class ErrorInterceptor  implements HttpInterceptor {

  constructor(private authService: AuthService, private dialog: MatDialog, private snackBar: MatSnackBar) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log(error.error);
        let errorMessage = error.error.message;
        if(errorMessage === 'Auth Failed') {
          errorMessage = 'Login Failed. Try Again!';
          this.authService.failAuth();
        } else if(errorMessage === 'Signup Failed') {
          errorMessage = 'Signup failed! Account with that email already exsists!'
        } else if(errorMessage === "Not valid class") {
          errorMessage = 'Not a valid class code. Please try again!'
        }
        this.snackBar.open(errorMessage, 'Continue', {
          duration: 4000
        });
        this.authService.failAuth();
        return throwError(error);
      })
    );
  }
}
