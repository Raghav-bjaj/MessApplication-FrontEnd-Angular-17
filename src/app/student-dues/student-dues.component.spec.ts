import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentDuesComponent } from './student-dues.component';

describe('StudentDuesComponent', () => {
  let component: StudentDuesComponent;
  let fixture: ComponentFixture<StudentDuesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentDuesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StudentDuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
