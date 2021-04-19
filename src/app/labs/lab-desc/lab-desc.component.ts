import { Component, OnInit } from '@angular/core';
import { LabData } from 'src/app/lab.model';
import { Example } from 'src/app/lab.example';
import { LabService } from 'src/app/lab.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ClassroomService } from 'src/app/classroom/classroom.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-lab-desc',
  templateUrl: './lab-desc.component.html',
  styleUrls: ['./lab-desc.component.css']
})
export class LabDescComponent implements OnInit {
  public labData: LabData;
  private labId: string;
  private initialCode: string;

  constructor(public labSerive: LabService, public route: ActivatedRoute, private authService: AuthService) {
  }

  ngOnInit() {
    this.labData = {
      labName: 't',
      labDesc: 't',
      labExamples: 't',
      starterCode: 'Start',
      labTestCases: 'hehe',
      id: null
    }

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if(paramMap.has('labId')) {
        this.labId = paramMap.get('labId');
        this.labSerive.getLab(this.labId).subscribe(labData => {
          this.labData = {
            labName: labData.labTitle,
            labDesc: labData.labDesc,
            labExamples: labData.labExamples,
            starterCode: labData.labStarter,
            labTestCases: labData.labTestCases,
            id: labData._id
          };
          this.initialCode = this.labData.starterCode;
        });
      }
    });
  }

}
