import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Import HttpClientTestingModule
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Import BrowserAnimationsModule
import { CreateCapsuleComponent } from './create-capsule.component';

describe('CreateCapsuleComponent', () => {
  let component: CreateCapsuleComponent;
  let fixture: ComponentFixture<CreateCapsuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule, // Add HttpClientTestingModule
        BrowserAnimationsModule, // Add BrowserAnimationsModule
        CreateCapsuleComponent
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateCapsuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
