import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { UserData } from './user.model';
import { stringToKeyValue } from '@angular/flex-layout/extended/typings/style/style-transforms';
import { ClassroomService } from '../classroom/classroom.service';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private isAuthenticated = false;
  private user: UserData;
  private token: string;
  private id: string;
  private tokenTimer;
  private classCode;
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router, private classService: ClassroomService) {}

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getUserData(userId) {
    return this.http.get<{isTeacher: boolean, classCode: string, id: string, email: string}>('http://localhost:3000/api/user/' + userId);
  }

  getUser() {
    return this.http.get<{isTeacher: boolean, classCode: string, id: string, email: string}>('http://localhost:3000/api/user/' + this.id);
  }

  failAuth() {
    this.authStatusListener.next(false);
  }

  createUser(email: string, password: string, role: string) {
    const atuhData: AuthData = {email: email, password: password, role: role };
    this.http.post("http://localhost:3000/api/user/signup", atuhData)
      .subscribe(response => {
        console.log(response);
      });

    this.router.navigate(['/login']);
  }

  login(email: string, password: string) {
    const atuhData: AuthData = {email: email, password: password, role: null};
    this.http.post<{token: string, expiresIn: number, id: string, classId: string}>("http://localhost:3000/api/user/login", atuhData)
      .subscribe(response => {
        this.id = response.id;
        const token = response.token;
        this.token = token;
        if (token) {
          const expiresInDuration = response.expiresIn;
          this.setAuthTimer(expiresInDuration);
          this.isAuthenticated = true;
          this.authStatusListener.next(true);
          const now = new Date();
          this.classCode = response.classId;
          this.classService.pushClassCode(this.classCode);
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
          this.saveAuthData(token,expirationDate);
          this.router.navigate(['/home']);
        }
      });
  }

  updateUserLab(labId, done , progress) {
    console.log(done);
    const userLabData = {
      userId: localStorage.getItem('userId'),
      labId: labId,
      done: done,
      progress: progress,
    };

    this.http.post<{message: string}>('http://localhost:3000/api/user/updateUserLab', userLabData)
      .subscribe(message => {
        console.log(message);
      });
  }

  updateUserLabNoProg(labId, done) {
    console.log(done);
    const userLabData = {
      userId: localStorage.getItem('userId'),
      labId: labId,
      done: done,
    };

    this.http.post<{message: string}>('http://localhost:3000/api/user/updateUserLab', userLabData)
      .subscribe(message => {
        console.log(message);
      });
  }

  getUserLab(labId) {
    const data = {
      labId: labId,
      userId: localStorage.getItem('userId')
    };
    return this.http.post<{completed: boolean, progress: string}>('http://localhost:3000/api/user/lab', data);
  }

  getUserLabData(userId, labId) {
    const data = {
      labId: labId,
      userId: userId
    };

    return this.http.post<{done: boolean, progress: string}>('http://localhost:3000/api/user/lab', data);
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expiration.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.id = authInformation.id;
      this.isAuthenticated = true;
      this.classCode = authInformation.classId;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/login']);
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
      this.clearAuthData();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date) {
    localStorage.setItem('token',token);
    localStorage.setItem('expiration',expirationDate.toISOString());
    localStorage.setItem('userId',this.id);
    localStorage.setItem('classId',this.classCode)
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('item');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
    localStorage.removeItem('classId');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const id = localStorage.getItem('userId');
    const classCode = localStorage.getItem('classId');

    if(!token || !expirationDate) {
      return;
    }

    return {
      token: token,
      expiration: new Date(expirationDate),
      id: id,
      classId: classCode
    }
  }
}
