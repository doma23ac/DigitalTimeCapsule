import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Import HttpClientTestingModule
import { PersonalPageComponent } from './personal-page.component';

describe('PersonalPageComponent', () => {
  let component: PersonalPageComponent;
  let fixture: ComponentFixture<PersonalPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule, // Include HttpClientTestingModule
        PersonalPageComponent
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PersonalPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
