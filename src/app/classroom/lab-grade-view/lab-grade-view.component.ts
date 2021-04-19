import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ClassroomService } from '../classroom.service';
import { AuthService } from 'src/app/auth/auth.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, ParamMap } from '@angular/router';

import * as ace from 'ace-builds';
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/theme-dracula';
import { MatTableDataSource } from '@angular/material';

const THEME = 'ace/theme/dracula';
const LANG = 'ace/mode/javascript';

@Component({
  selector: 'app-lab-grade-view',
  templateUrl: './lab-grade-view.component.html',
  styleUrls: ['./lab-grade-view.component.css']
})
export class LabGradeViewComponent implements OnInit {


  @ViewChild('codeEditor', {static: true}) codeEditorElmRef: ElementRef;
  private codeEditor: ace.Ace.Editor;
  private classCode: string;
  private classCodeSub: Subscription;
  private dataSource = new MatTableDataSource<{email: String, done: boolean, progress: String}>([]);
  private displayData;
  public shwoView = false;
  displayedColumns: string[] = ['Student', 'Status', 'Progress'];

  constructor(private classService: ClassroomService, private authService: AuthService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.displayData = {
      tablePercentage: '100%',
      viewPercentage: '0%'
    };

    const element = this.codeEditorElmRef.nativeElement;
    const editorOptions: Partial<ace.Ace.EditorOptions> = {
        highlightActiveLine: true,
        minLines: 30,
        maxLines: Infinity,
      };
    this.codeEditor = ace.edit(element, editorOptions);
    this.codeEditor.setTheme(THEME);
    this.codeEditor.getSession().setMode(LANG);
    this.codeEditor.setShowFoldWidgets(true); // for the scope fold feature
    this.codeEditor.setReadOnly(true);
    this.classCode = localStorage.getItem('classId');
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('labId')) {
        this.classService.getClass(this.classCode).subscribe(classData => {
          classData.students.forEach(student => {
            let studentData = {
              email: 'Email',
              done: true,
              progress: 'progress'
            }
            this.authService.getUserData(student).subscribe(userData => {
              studentData.email = userData.email;
              this.authService.getUserLabData(student,paramMap.get('labId')).subscribe(data => {
                studentData.done = data.done,
                studentData.progress = data.progress

                const temp = this.dataSource.data;
                temp.push(studentData);
                this.dataSource.data = temp;
              });
            });
          });
        });
      }
    });
  }

  displayProgress(progress) {
    this.shwoView = !this.shwoView;

    this.codeEditor.setValue(progress);
    this.displayData = {
      tablePercentage: '40%',
      viewPercentage: '60%'
    };
  }
}
