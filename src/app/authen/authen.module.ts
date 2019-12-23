import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { AuthenRoutingModule } from './authen-routing.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthenInterceptor } from './authen-interceptor';

@NgModule({
  declarations: [LoginComponent, SignupComponent],
  imports: [SharedModule, AuthenRoutingModule],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthenInterceptor, multi: true }
  ]
})
export class AuthenModule {
  constructor() {
    console.log('AuthenModule loaded.');
  }
}
