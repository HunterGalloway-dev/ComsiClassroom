import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LabGradeViewComponent } from './lab-grade-view.component';

describe('LabGradeViewComponent', () => {
  let component: LabGradeViewComponent;
  let fixture: ComponentFixture<LabGradeViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LabGradeViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabGradeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
