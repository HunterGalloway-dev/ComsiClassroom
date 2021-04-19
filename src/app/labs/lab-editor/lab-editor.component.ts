import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LabService } from '../../lab.service';
import { ActivatedRoute } from '@angular/router';
import { LabData } from '../../lab.model';

@Component({
  selector: 'app-lab-editor',
  templateUrl: './lab-editor.component.html',
  styleUrls: ['./lab-editor.component.css']
})
export class LabEditorComponent implements OnInit {

  form: FormGroup;
  private mode = 'create';
  private labId: string;
  private labData: LabData;

  constructor(public labService: LabService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.form = new FormGroup({
      labTitle: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      labDescription: new FormControl(null, {
        validators: [Validators.required]
      }),
      labExamples: new FormControl(null, {
        validators: [Validators.required]
      }),
      labTestCases: new FormControl(null, {
        validators: [Validators.required]
      }),
    });

    this.route.paramMap.subscribe((paramMap) => {
      if (paramMap.has('labId')) {
        this.mode = 'edit';
        this.labId = paramMap.get('labId');
        this.labService.getLab(this.labId).subscribe(labData => {
          console.log("TEST: ",labData);
          this.labData = {
            labName: labData.labTitle,
            labDesc: labData.labDesc,
            labExamples: labData.labExamples,
            starterCode: labData.labStarter,
            labTestCases: labData.labTestCases,
            id: labData._id
          };
          this.form.setValue({
            labTitle: this.labData.labName,
            labDescription: this.labData.labDesc,
            labExamples: this.labData.labExamples,
            labTestCases: this.labData.labTestCases
          });
        });

      } else {
        this.mode = 'create';
        this.labId = null;
      }
    });
  }

  onSaveLab(starterCode) {
    if (this.form.invalid) {
      return;
    }

    if (this.mode === 'create') {
      this.labService.saveLab(
        /*this.form.value.labTitle,
        this.form.value.labDescription,
        this.form.value.labExamples,
        this.form.value.labTestssssCases,
        this.form.value.labStarterCode*/
        this.form.value.labTitle,
        this.form.value.labDescription,
        this.form.value.labExamples,
        this.form.value.labTestCases,
        starterCode
      );
    } else {
      this.labService.updatePost(
        this.labId,
        this.form.value.labTitle,
        this.form.value.labDescription,
        this.form.value.labExamples,
        this.form.value.labTestCases,
        starterCode
      )
    }

    this.form.reset();
  }
}
