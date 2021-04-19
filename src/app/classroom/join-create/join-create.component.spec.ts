import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinCreateComponent } from './join-create.component';

describe('JoinCreateComponent', () => {
  let component: JoinCreateComponent;
  let fixture: ComponentFixture<JoinCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JoinCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JoinCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
