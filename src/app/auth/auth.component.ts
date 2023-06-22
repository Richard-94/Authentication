import { Token } from '@angular/compiler';
import { AuthResponseData, AuthService } from './auth.service';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable, Subject, delay } from 'rxjs';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent {
  isLoginMode:boolean=true
  isLoading:boolean=false
  error!:string

  constructor(private authSvc:AuthService){

  }

  onSwitchMode(){
    this.isLoginMode =!this.isLoginMode
  }
  onSubmit(form: NgForm) {
    if (!form.valid) {
      return; // form not submitted if it's invalid
    }

    console.log(form.value);
    const email = form.value.email;
    const password = form.value.password;

    let authObs: Observable<AuthResponseData>;

    this.isLoading = true;

    if (this.isLoginMode) {
      authObs = this.authSvc.login(email, password);
    } else {
      authObs = this.authSvc.signUp(email, password).pipe(delay(3000));
    }

    authObs.subscribe(
      resData => {
        console.log(resData);
        this.isLoading = false;
      },
      errorMessage => {
        console.log(errorMessage);
        this.error = errorMessage;
        this.isLoading = false;
      }
    );

    form.reset();
  }

}
