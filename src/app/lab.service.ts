import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators'
import { LabData } from './lab.model';
import { stringToKeyValue } from '@angular/flex-layout/extended/typings/style/style-transforms';
import { conditionallyCreateMapObjectLiteral } from '@angular/compiler/src/render3/view/util';
import { Router } from '@angular/router';
import { ClassroomService } from './classroom/classroom.service';


@Injectable({providedIn: 'root'})
export class LabService {
  private labs: LabData [] = [];
  private output = '';
  private outputUpdated = new Subject<string>();

  private isRunning = false;
  private runningUpdated = new Subject<boolean>();
  private isDoneUpdate = new Subject<boolean>();

  private labsUpdated = new Subject<{labs: LabData[]}>();

  constructor(private http: HttpClient, public router: Router, private classService: ClassroomService) {}

  getOutputUpdateListener() {
    return this.outputUpdated.asObservable();
  }

  getLabsUpdateListener() {
    return this.labsUpdated.asObservable();
  }

  getIsDoneUpdateListener() {
    return this.isDoneUpdate.asObservable();
  }

  isDone() {
    this.isDoneUpdate.next(true);
  }

  saveLab(labName: string, labDesc: string, labExamples: string, labTestCases: string, labStarter: string) {
    let labData: LabData;

    labData = {
      labName,
      labDesc,
      labExamples,
      starterCode: labStarter,
      labTestCases: labTestCases,
      id: null
    };

    this.http.post<{message: string, lab: LabData}>("http://localhost:3000/api/labs", labData)
      .subscribe((responseData) => {
        const responseLab : LabData = {
          labName: responseData.lab.labName,
          labDesc: responseData.lab.labDesc,
          labExamples: responseData.lab.labExamples,
          starterCode: responseData.lab.starterCode,
          labTestCases: responseData.lab.labTestCases,
          id: responseData.lab.id
        }
        this.labs.push(responseLab);
        this.labsUpdated.next({labs: [...this.labs]});
        this.router.navigate(['/']);
        this.classService.addLab(localStorage.getItem('classId'), responseLab.id);
      });
  }

  updatePost(labId: string, labName: string, labDesc: string, labExamples: string, labTestCases: string, labStarter: string) {
    let labData: LabData;

    labData = {
      labName,
      labDesc,
      labExamples,
      starterCode: labStarter,
      labTestCases: labTestCases,
      id: labId
    };

    this.http.put('http://localhost:3000/api/labs/'+labId,labData)
      .subscribe(response => {
        const updatedLabs = [...this.labs];
        const oldPostIndex = updatedLabs.findIndex(l => l.id === labId);
        const lab: LabData = {
          id: labId,
          labName,
          labDesc,
          labExamples,
          labTestCases,
          starterCode: labStarter
        };
        updatedLabs[oldPostIndex] = lab;
        this.labs = updatedLabs;
        this.labsUpdated.next({labs: [...this.labs]});
        this.router.navigate(['/']);
      });
  }

  deleteLab(labId) {
    return this.http.delete('http://localhost:3000/api/labs/'+ labId);
  }

  getLabs() {
    this.http.get<{message: string, labs: any}>('http://localhost:3000/api/labs')
      .pipe(
        map(labData => {
          return {
            labs: labData.labs.map(lab => {
              return {
                labName: lab.labTitle,
                labDesc: lab.labDesc,
                starterCode: lab.labStarter,
                labexamples: lab.labExamples,
                labTestCases: lab.labTestCases,
                id: lab._id
              }
            })
          };
        })
      )
      .subscribe(transformedData => {
        this.labs = transformedData.labs;
        this.labsUpdated.next({
          labs: [...this.labs],
        });
      });
  }

  getLab(labId) {
    return this.http.get<{_id: string, labTitle: string, labDesc: string, labExamples: string, labTestCases,labStarter: string}>('http://localhost:3000/api/labs/'+labId);
  }

  runCode(code) {
    this.isRunning = true;
    const file = {
      lang: 'java',
      program: code
    };

    this.http.post<{code: string}>('http://localhost:3000/api/run', file)
     .subscribe((response) => {
        this.output += response.code + '\n';
        this.outputUpdated.next(response.code);
        this.isRunning = false;
     });
  }
}
