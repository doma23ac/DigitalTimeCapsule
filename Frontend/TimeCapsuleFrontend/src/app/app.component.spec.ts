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
      imports: [RouterModule, MaterialModule],
      declarations: [AppComponent, MockIframeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle isMuted state and update iframe src to unmute', () => {
    const iframe = document.querySelector('iframe');
    spyOn(iframe!, 'setAttribute');

    // Ensure initial state is muted
    component.isMuted = true;
    iframe?.setAttribute('src', 'https://www.youtube.com/embed/example?mute=1');

    component.toggleSound();

    expect(component.isMuted).toBe(false);
    expect(iframe?.setAttribute).toHaveBeenCalledWith(
      'src',
      'https://www.youtube.com/embed/example?mute=0'
    );
  });

  it('should toggle isMuted state and update iframe src to mute', () => {
    const iframe = document.querySelector('iframe');
    spyOn(iframe!, 'setAttribute');

    // Ensure initial state is unmuted
    component.isMuted = false;
    iframe?.setAttribute('src', 'https://www.youtube.com/embed/example?mute=0');

    component.toggleSound();

    expect(component.isMuted).toBe(true);
    expect(iframe?.setAttribute).toHaveBeenCalledWith(
      'src',
      'https://www.youtube.com/embed/example?mute=1'
    );
  });
});
