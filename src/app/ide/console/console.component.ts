import { Component, OnInit, OnDestroy } from '@angular/core';
import { LabService } from '../../lab.service';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { IdeComponent } from '../ide.component';

@Component({
  selector: 'app-console',
  templateUrl: './console.component.html',
  styleUrls: ['./console.component.css']
})
export class ConsoleComponent implements OnInit, OnDestroy {
  public outputText = ''; // Stores the complete output overtime
  private outSub: Subscription; // Subscription used to subscribe to the lab service component

  constructor(public labService: LabService, private snackBar: MatSnackBar, public route: ActivatedRoute, private authService: AuthService) { } // Uses the public header to automatically create the lab service property

  /*
    Subscribes to the lab service and updates our outputText property
    when the lab service has updated the output
  */

  // tslint:disable-next-line: ban-types
  expectedOutput: String = 'null';
  labId: String
  private ide: IdeComponent;
  private isTeacher: boolean;

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.authService.getUser().subscribe(userData =>{
        this.isTeacher = userData.isTeacher;
      });
      if (paramMap.has('labId')) {
        this.labService.getLab(paramMap.get('labId'))
          .subscribe(labData => {
            this.expectedOutput = labData.labTestCases;
          });
      }
    });
    this.outSub = this.labService.getOutputUpdateListener()
      .subscribe((out: string) => {
        this.outputText = out;
        if(this.expectedOutput === 'null') {
          return;
        }
        let output: string;
        if (out.trim() === this.expectedOutput.trim()) {
          output = 'Lab Completed. Good Job!';
          this.labService.isDone();
        } else {
          output = 'Uh oh! Try again!';
        }
        this.snackBar.open(output, 'Close', {duration: 4000});
      });

  }

  test() {
    console.log(this.expectedOutput);
  }

  // Unsubscribes from the lab service component so shit doesn't break
  ngOnDestroy() {
    this.outSub.unsubscribe();
  }
}
