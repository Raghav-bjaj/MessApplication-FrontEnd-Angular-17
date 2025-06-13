import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentTotalComponent } from './student-total.component';

describe('StudentTotalComponent', () => {
  let component: StudentTotalComponent;
  let fixture: ComponentFixture<StudentTotalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentTotalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StudentTotalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
