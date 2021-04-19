import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-lab-page',
  templateUrl: './lab-page.component.html',
  styleUrls: ['./lab-page.component.css']
})
export class LabPageComponent implements OnInit {

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  onSaveLab(lab) {
  }
}
