import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { ClassroomService } from '../classroom.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-join-create',
  templateUrl: './join-create.component.html',
  styleUrls: ['./join-create.component.css']
})
export class JoinCreateComponent implements OnInit {

  classCreateForm: FormGroup;
  classJoinForm: FormGroup;
  isTeacher: boolean;
  classCode: string = 'null';

  constructor(private authService: AuthService, private classService: ClassroomService) { }

  ngOnInit() {
    this.authService.getUser().subscribe(user => {
      this.isTeacher = user.isTeacher;
      this.classCode = user.classCode;
      console.log('user',user);
    });

    this.classCreateForm = new FormGroup({
      classTitle: new FormControl(null, {
        validators: [Validators.required ]
      }),
    });

    this.classJoinForm = new FormGroup({
      classCode: new FormControl(null, {
        validators: [Validators.required]
      }),
    });
  }

  onCreateClass() {
    this.classService.createClass(this.classCreateForm.value.classTitle);
  }

  onJoinClass() {
    this.classService.getClass(this.classJoinForm.value.classCode).subscribe(response => {
      this.classService.joinClass(this.classJoinForm.value.classCode);
    });
  }

}
