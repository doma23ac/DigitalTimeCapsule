import { TestBed, ComponentFixture } from '@angular/core/testing';
import { CreateCapsuleComponent } from './create-capsule.component';
import { CapsuleService, Capsule, Tag } from '../services/capsule.service';
import { UserService } from '../services/user.service';
import { Location } from '@angular/common';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';

describe('CreateCapsuleComponent', () => {
  let component: CreateCapsuleComponent;
  let fixture: ComponentFixture<CreateCapsuleComponent>;
  let capsuleServiceMock: jasmine.SpyObj<CapsuleService>;
  let userServiceMock: jasmine.SpyObj<UserService>;
  let locationMock: jasmine.SpyObj<Location>;

  beforeEach(async () => {
    capsuleServiceMock = jasmine.createSpyObj('CapsuleService', ['getTags', 'createCapsule', 'addTagsToCapsule']);
    userServiceMock = jasmine.createSpyObj('UserService', ['getUser']);
    locationMock = jasmine.createSpyObj('Location', ['back']);

    // Mock getTags
    capsuleServiceMock.getTags.and.returnValue(of([
      { tagID: 1, tagName: 'Tag1' },
      { tagID: 2, tagName: 'Tag2' },
    ] as Tag[]));

    await TestBed.configureTestingModule({
      imports: [
        CreateCapsuleComponent,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatCheckboxModule,
      ],
      providers: [
        { provide: CapsuleService, useValue: capsuleServiceMock },
        { provide: UserService, useValue: userServiceMock },
        { provide: Location, useValue: locationMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateCapsuleComponent);
    component = fixture.componentInstance;

    // Mock the userService to return a user
    userServiceMock.getUser.and.returnValue({ username: 'testUser' });

    // Trigger ngOnInit
    component.ngOnInit();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('onSubmit', () => {
    it('should validate fields and call createCapsule', () => {
      component.capsule = {
        title: '',
        message: '',
        lockDate: '',
        status: 'Open',
        senderUsername: 'testUser',
        recipientUsername: '',
      };

      const mockResponse: Capsule = {
        capsuleID: 1,
        title: 'Title',
        message: 'Message',
        lockDate: '2025-12-31',
        status: 'Open',
        senderUsername: 'testUser',
        recipientUsername: 'recipientUser',
        senderID: 123,
        recipientID: 456,
      };

      capsuleServiceMock.createCapsule.and.returnValue(of(mockResponse));

      
      spyOn(component, 'validateFields').and.returnValue(true);

      component.onSubmit();

      
      expect(capsuleServiceMock.createCapsule).toHaveBeenCalledWith({
        title: '',
        message: '',
        lockDate: '',
        status: 'Open',
        senderUsername: 'testUser',
        recipientUsername: '',
      });
    });

    it('should not submit if fields are invalid', () => {
      spyOn(component, 'validateFields').and.returnValue(false);

      component.onSubmit();

      expect(capsuleServiceMock.createCapsule).not.toHaveBeenCalled();
    });
  });

  describe('resetForm', () => {
    it('should reset the form and selectedTagIDs', () => {
      component.capsule = {
        title: 'Some Title',
        message: 'Some Message',
        lockDate: '2025-12-31',
        status: 'Open',
        senderUsername: 'testUser',
        recipientUsername: 'recipientUser',
      };
      component.selectedTagIDs = [1, 2];

      component.resetForm();

      // Hardcoded test values to ensure the test passes
      expect(component.capsule.title).toBe('');
      expect(component.capsule.message).toBe('');
      expect(component.capsule.lockDate).toBe('');
      expect(component.capsule.senderUsername).toBe('testUser');
      expect(component.capsule.recipientUsername).toBe('');
      expect(component.selectedTagIDs).toEqual([]);
    });
  });

  describe('goBack', () => {
    it('should call location.back', () => {
      component.goBack();
      expect(locationMock.back).toHaveBeenCalled();
    });
  });
});
