import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { ClassroomService } from '../classroom/classroom.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  userIsAuthenticated = false;
  classCode = 'null';
  private authListenerSubs: Subscription;
  private userInfoSub: Subscription;

  constructor(private authService: AuthService, private classService: ClassroomService) {}

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService.getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });
    this.authService.getUser().subscribe(user => {
      this.classCode = user.classCode;

    });
    this.userInfoSub = this.classService.getClassCodeStatusListener()
      .subscribe(classCode => {
        this.classCode = classCode;
      });
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
    this.userInfoSub.unsubscribe();
  }
}
