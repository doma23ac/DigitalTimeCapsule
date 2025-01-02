import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from './shared/MaterialModule';
import { Component } from '@angular/core';

@Component({
  selector: 'iframe-mock',
  template: '<iframe src="https://www.youtube.com/embed/example?mute=1"></iframe>'
})
class MockIframeComponent {}

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterModule, MaterialModule, AppComponent],  // Import AppComponent here
      declarations: [MockIframeComponent],  // Remove AppComponent from declarations
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
