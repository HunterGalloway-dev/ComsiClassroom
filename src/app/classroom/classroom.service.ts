import { Injectable } from "@angular/core";
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ClassData } from './class.model';
import { stringToKeyValue } from '@angular/flex-layout/extended/typings/style/style-transforms';
import { Subject } from 'rxjs';

@Injectable({providedIn: 'root'})
export class ClassroomService {

  private classCodeStatusListener = new Subject<string>();

  constructor( private router: Router, private http: HttpClient) {}

  getClassCodeStatusListener() {
    return this.classCodeStatusListener.asObservable();
  }

  pushClassCode(code) {
    this.classCodeStatusListener.next(code);
  }

  createClass(className: string) {
    let classData: ClassData = {
      className: className,
      teacherId: localStorage.getItem('userId'),
      labs: []
    }

    console.log("Creating class: ",className);
    return this.http.post<{message: string, result: {_id: string}}>("http://localhost:3000/api/classroom/create", classData)
    .subscribe(responseData => {
      this.classCodeStatusListener.next(responseData.result._id);
      localStorage.setItem('classId',responseData.result._id);
      this.router.navigate(['/']);
    });
    /*this.http.post<{message: string, result: {_id: string}}>("http://localhost:3000/api/classroom/create", classData)
      .subscribe(response => {
        console.log(response.result._id);
        localStorage.setItem('classId',response.result._id);
      });
      */
  }

  joinClass(classId: string) {
    const data = {
      classId: classId,
      userId: localStorage.getItem('userId'),
    }
    this.http.post<{isTeacher: boolean, classCode: string}>("http://localhost:3000/api/classroom/join", data)
      .subscribe(responseData => {
        this.classCodeStatusListener.next(responseData.classCode);
        localStorage.setItem('classId', classId);
        this.router.navigate(['/']);
      });
    /*
    this.http.post("http://localhost:3000/api/classroom/join", data)
      .subscribe(response => {
        localStorage.setItem('classId', classId);
        console.log(response);
      });
    */

  }

  getClass(classId: string) {
    return this.http.get<{className: String, labs: [{_id: string}], students: [String]}>('http://localhost:3000/api/classroom/' + classId);
  }

  addLab(classId, labId) {
    this.http.post("http://localhost:3000/api/classroom/addlab", {classId: classId, labId: labId})
      .subscribe(response => {
        console.log(response);
      });
  }
}
