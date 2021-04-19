
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';



import { LabService } from '../lab.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { LabData } from '../lab.model';
import { AuthService } from '../auth/auth.service';

import * as ace from 'ace-builds';
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/theme-dracula';

const THEME = 'ace/theme/dracula';
const LANG = 'ace/mode/javascript';

@Component({
  selector: 'app-ide',
  templateUrl: './ide.component.html',
  styleUrls: ['./ide.component.css']
}) export class IdeComponent implements OnInit {

  mode = 'indeterminate';
  showProgress = false;
  /*
  */
  private runningSub: Subscription;

  @ViewChild('codeEditor',{static: true}) codeEditorElmRef: ElementRef;
  private codeEditor: ace.Ace.Editor;
  private labData: LabData;
  private labId: string;
  private starterCode: string;
  private code: string;
  private done: boolean;
  private isDoneSub: Subscription;
  private isTeacher: boolean = false;

  constructor(public labService: LabService, private route: ActivatedRoute, private authService: AuthService) { }

  ngOnInit () {
      this.authService.getUser().subscribe(user => {
        this.isTeacher = user.isTeacher;
      });
      this.isDoneSub = this.labService.getIsDoneUpdateListener().subscribe(isDone => {
        this.done = isDone;
        this.onSave();
      });
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

      this.route.paramMap.subscribe((paramMap) => {
        if (paramMap.has('labId')) {
          this.mode = 'edit';
          this.labId = paramMap.get('labId');
          this.labService.getLab(this.labId).subscribe(labData => {
            this.codeEditor.setValue(labData.labStarter);
            this.starterCode = labData.labStarter;
            if(this.code) {
              this.codeEditor.setValue(this.code);
            }

          });
          this.authService.getUserLab(this.labId).subscribe(userData => {
            if(!userData) {
              this.authService.updateUserLab(this.labId,Boolean(false),this.starterCode);
            } else {
              this.code = userData.progress;
              this.done = userData.completed;
              this.codeEditor.setValue(this.code);
            }
          });
        } else {
          this.mode = 'create';
          this.labId = null;
        }
      });

    }

  onSave() {
    this.authService.updateUserLab(this.labId,Boolean(this.done),this.getValue());
  }

   getValue() {
     return this.codeEditor.getValue();
   }

   reset() {
     this.codeEditor.setValue(this.starterCode);
   }

   public onRun() {
     this.showProgress = true;
     const code = this.codeEditor.getValue();
     this.labService.runCode(code);
     this.showProgress = false;
   }
}
