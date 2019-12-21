import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { AuthenRoutingModule } from './authen-routing.module';

@NgModule({
  declarations: [LoginComponent, SignupComponent],
  imports: [SharedModule, AuthenRoutingModule]
})
export class AuthenModule {
  constructor() {
    console.log('AuthenModule loaded.');
  }
}
