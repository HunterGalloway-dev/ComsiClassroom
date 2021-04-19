import { Component, OnInit, OnDestroy } from '@angular/core';
import { LabData } from '../lab.model';
import { Example } from '../lab.example';
import { TestBed } from '@angular/core/testing';
import { LabService } from '../lab.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { UserData } from '../auth/user.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ClassroomService } from './classroom.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-classroom',
  templateUrl: './classroom.component.html',
  styleUrls: ['./classroom.component.css']
})
export class ClassroomComponent implements OnInit, OnDestroy {

  isTeacher: boolean;
  isLoading = true;
  classCode: string = 'null';
  classTitle: String;
  labs: LabData[];

  userIsAuthenticated: boolean;
  private labSub: Subscription;
  private authStatusSub: Subscription;
  private classCodeSub: Subscription;

  constructor(public labService: LabService, private authService: AuthService, private classService: ClassroomService, private router: Router) { }

  ngOnInit() {
    this.authService.getUser().subscribe(user => {
      this.isTeacher = user.isTeacher;
      this.classCode = user.classCode;
    });

    this.update();

    this.classCodeSub = this.classService.getClassCodeStatusListener()
      .subscribe(classCode => {
        this.update();

      });
  }

  update() {

    this.labService.getLabs();

    this.labSub = this.labService
      .getLabsUpdateListener()
      .subscribe((labData: {labs: LabData[]}) => {
        this.labs = labData.labs;

        const id = localStorage.getItem('classId');
        if(id === 'null') {
          return;
        }

        this.classService.getClass(id)
        .subscribe(classData => {
          this.classTitle = classData.className;
          this.classCode = localStorage.getItem('classId');
          let whiteList: String[] = [];
          // tslint:disable-next-line: prefer-for-of
          classData.labs.forEach(data => {
            whiteList.push(data._id);
          });

          this.labs = this.labs.filter(lab => whiteList.includes(lab.id));
          this.isLoading = false;
        });
      });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });
  }

  onDelete(labId) {
    this.labService.deleteLab(labId).subscribe(() => {
      this.labService.getLabs();
    });
  }
/*
  onCreateClass() {
    this.classService.createClass(this.classCreateForm.value.classTitle)
      .subscribe(response => {
        const id = response.result._id;
        localStorage.setItem('classId',id);
        this.classCode = id;

        this.update();
      });
  }

  onJoinClass() {
    this.classService.joinClass(this.classJoinForm.value.classCode)
      .subscribe(response => {
        localStorage.setItem('classId', this.classJoinForm.value.classCode);
        this.classCode = this.classJoinForm.value.classCode;

        this.update();
      });
  }
  */

  ngOnDestroy() {
    this.labSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }

}
