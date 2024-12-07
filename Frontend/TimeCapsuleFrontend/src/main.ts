import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withDebugTracing } from '@angular/router';
import { AppComponent } from './app/app.component';
import { SignupComponent } from './app/signup/signup.component';
import { PersonalPageComponent } from './app/personal-page/personal-page.component';
import { CreateCapsuleComponent } from './app/create-capsule/create-capsule.component';
import { ViewCapsulesComponent } from './app/view-capsules/view-capsules.component';
import { CapsuleDetailComponent } from './app/capsule-detail/capsule-detail.component';
import { provideHttpClient } from '@angular/common/http';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter([
      { path: '', component: AppComponent },
      { path: 'signup', component: SignupComponent },
      { path: 'personal', component: PersonalPageComponent },
      { path: 'create-capsule', component: CreateCapsuleComponent },
      { path: 'view-capsules', component: ViewCapsulesComponent },
      { path: 'capsule-detail/:id', component: CapsuleDetailComponent },
    ], withDebugTracing()),
    provideHttpClient(), 
  ]
});




