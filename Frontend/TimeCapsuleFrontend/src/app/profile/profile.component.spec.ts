import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { ProfileComponent } from './profile.component';
import { UserService } from '../services/user.service';
import { of, throwError } from 'rxjs';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let mockUserService: jasmine.SpyObj<UserService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockUserService = jasmine.createSpyObj('UserService', ['getUser', 'setUser', 'clearUser']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        BrowserAnimationsModule,
        ProfileComponent
      ],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: Router, useValue: mockRouter }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set user details if logged in', () => {
      const mockUser = { username: 'testuser', email: 'test@example.com', userId: 1 };
      mockUserService.getUser.and.returnValue(mockUser);

      component.ngOnInit();

      expect(component.user).toEqual(mockUser);
      expect(component.errorMessage).toBeNull();
    });

    it('should redirect to login if no user is logged in', () => {
      mockUserService.getUser.and.returnValue(null);

      component.ngOnInit();

      expect(component.errorMessage).toContain('No user is logged in');
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
    });
  });

  describe('onUpdate', () => {
    it('should show error for invalid email', () => {
      component.user.email = 'invalidemail';
      component.onUpdate();

      expect(component.errorMessage).toBe('Invalid email address.');
    });

    it('should show error for invalid password', () => {
      component.user.email = 'valid@example.com';
      component.password = 'short';
      component.onUpdate();

      expect(component.errorMessage).toContain('Password must contain at least one uppercase');
    });

    it('should update profile successfully', () => {
      const mockUser = { username: 'updatedUser', email: 'updated@example.com', userId: 1 };
      component.user = { ...mockUser };
      component.password = '';
      spyOn(component['http'], 'put').and.returnValue(of({}));

      component.onUpdate();

      expect(component.successMessage).toBe('Your profile has been updated successfully.');
      expect(mockUserService.setUser).toHaveBeenCalledWith({
        userId: mockUser.userId,
        username: mockUser.username,
        email: mockUser.email
      });
    });

    it('should handle error during profile update', () => {
      spyOn(component['http'], 'put').and.returnValue(throwError(() => new Error()));

      component.onUpdate();

      expect(component.errorMessage).toBe('Failed to update profile. Please try again.');
    });
  });

  describe('onDelete', () => {
    it('should confirm and delete account successfully', () => {
      spyOn(window, 'confirm').and.returnValue(true);
      spyOn(component['http'], 'delete').and.returnValue(of({}));

      component.onDelete();

      expect(component.successMessage).toBe('Your account has been deleted.');
      expect(mockUserService.clearUser).toHaveBeenCalled();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('should handle error during account deletion', () => {
      spyOn(window, 'confirm').and.returnValue(true);
      spyOn(component['http'], 'delete').and.returnValue(throwError(() => new Error()));

      component.onDelete();

      expect(component.errorMessage).toBe('Failed to delete your account. Please try again.');
    });

    it('should not delete account if user cancels', () => {
      spyOn(window, 'confirm').and.returnValue(false);

      component.onDelete();

      expect(mockUserService.clearUser).not.toHaveBeenCalled();
    });
  });

  describe('navigateToPersonalPage', () => {
    it('should navigate to personal page', () => {
      component.navigateToPersonalPage();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/personal']);
    });
  });

  describe('Validation Methods', () => {
    it('should validate email correctly', () => {
      expect(component.validateEmail('valid@example.com')).toBeTrue();
      expect(component.validateEmail('invalid-email')).toBeFalse();
    });

    it('should validate password correctly', () => {
      expect(component.validatePassword('Pass@123')).toBeTrue();
      expect(component.validatePassword('short')).toBeFalse();
      expect(component.validatePassword('nocaps123')).toBeFalse();
    });
  });
});
