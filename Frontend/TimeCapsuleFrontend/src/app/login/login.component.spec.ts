import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { LoginComponent } from './login.component';
import { UserService } from '../services/user.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let userServiceMock: any;
  let routerMock: any;

  beforeEach(async () => {
    userServiceMock = {
      validateUser: jasmine.createSpy('validateUser').and.returnValue(of({ message: 'Login successful' })),
      setCredentials: jasmine.createSpy('setCredentials'),
      setUser: jasmine.createSpy('setUser'),
    };

    routerMock = {
      navigate: jasmine.createSpy('navigate'),
    };

    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        BrowserAnimationsModule,
        LoginComponent,
      ],
      providers: [
        { provide: UserService, useValue: userServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to personal page on successful login', () => {
    component.loginData = { email: 'test@example.com', password: 'password123' };

    component.onLogin();

    expect(userServiceMock.validateUser).toHaveBeenCalledWith('test@example.com', 'password123');
    expect(userServiceMock.setCredentials).toHaveBeenCalledWith('test@example.com', 'password123');
    expect(userServiceMock.setUser).toHaveBeenCalledWith({ message: 'Login successful' });
    expect(routerMock.navigate).toHaveBeenCalledWith(['/personal']);
    expect(component.errorMessage).toBeNull();
  });

  it('should display an error message on invalid credentials', () => {
    userServiceMock.validateUser.and.returnValue(throwError(() => new Error('Invalid credentials')));

    component.loginData = { email: 'wrong@example.com', password: 'wrongpassword' };

    component.onLogin();

    expect(userServiceMock.validateUser).toHaveBeenCalledWith('wrong@example.com', 'wrongpassword');
    expect(component.errorMessage).toBe('Email address or password is wrong. Try again.');
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('should navigate to signup page', () => {
    component.navigateToSignup();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/signup']);
  });
});
