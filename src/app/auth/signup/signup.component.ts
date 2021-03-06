import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  isLoading = false;
  selector: any;

  constructor(public authService: AuthService) { }

  ngOnInit() {
    this.selector = "student";
  }

  onSignup(form: NgForm) {
    if(form.invalid) {
      return;
    }
    this.isLoading = true;
    console.log(this.selector);
    this.authService.createUser(form.value.email, form.value.password,this.selector);
  }
}
