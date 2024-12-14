import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withDebugTracing } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { LoginComponent } from './app/login/login.component';
import { SignupComponent } from './app/signup/signup.component';
import { PersonalPageComponent } from './app/personal-page/personal-page.component';
import { CreateCapsuleComponent } from './app/create-capsule/create-capsule.component';
import { ViewCapsulesComponent } from './app/view-capsules/view-capsules.component';
import { CapsuleDetailComponent } from './app/capsule-detail/capsule-detail.component';
import { ProfileComponent } from './app/profile/profile.component'; // Import the ProfileComponent

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter([
      { path: '', component: LoginComponent },  // Default route to login
      { path: 'login', component: LoginComponent },
      { path: 'signup', component: SignupComponent },
      { path: 'personal', component: PersonalPageComponent },
      { path: 'create-capsule', component: CreateCapsuleComponent },
      { path: 'view-capsules', component: ViewCapsulesComponent },
      { path: 'capsule-detail/:id', component: CapsuleDetailComponent },
      { path: 'profile', component: ProfileComponent }, // Add the profile route
    ], withDebugTracing()),  // Debugging enabled for routing
    provideHttpClient(),  // Provide HTTP client
  ]
});






