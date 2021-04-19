import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

export interface DialogData {
  error: String;
}

@Component({
  selector: 'app-err',
  templateUrl: './err.component.html',
  styleUrls: ['./err.component.css']
})
export class ErrComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ErrComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  ngOnInit() {
  }

}
