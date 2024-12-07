import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCapsulesComponent } from './view-capsules.component';

describe('ViewCapsulesComponent', () => {
  let component: ViewCapsulesComponent;
  let fixture: ComponentFixture<ViewCapsulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewCapsulesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewCapsulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
