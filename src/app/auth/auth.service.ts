import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, catchError, tap, throwError } from 'rxjs';
import { User } from './user';
import { Router } from '@angular/router';


export interface AuthResponseData{//interfaccia della risposta, optional
  kind:string,
  idToken:string,
  email:string,
  refreshToken:string,
  expiresIn:string,
  localId:string,
  registered?:boolean
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http:HttpClient, private router:Router) { }


  signUpAddress:string = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCvqi8ym4Hp_N2aubDj936O2NGHd7Sx_DY'
  signInAddress:string = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCvqi8ym4Hp_N2aubDj936O2NGHd7Sx_DY'

  user = new BehaviorSubject<User | null>(null) //subscribe anytime a data is emmitted, behaviour subjests gives immediate access the previous values even if they havent subscribe at the time the value eas emmited
  private tokenExpirationTimer: any




  signUp(email:string,password:string){
    return this.http.post<AuthResponseData>(this.signUpAddress,{
      email:email,
      password:password,
      returnSecureToken:true

    }
    )
    .pipe(
      (catchError(this.handleError),
      tap(resData =>{
        this.handleAuthentication(
          resData.email,
          resData.localId,
          +resData.expiresIn,
          resData.idToken)
      }))
    )
  }


  login(email:string, password:string){
    return this.http.post<AuthResponseData>(this.signInAddress,{
      email:email,
      password:password,
      returnSecureToken:true
    }
    )
    .pipe(
      catchError(this.handleError),
      tap(resData =>{
        this.handleAuthentication(
          resData.email,
          resData.localId,
          +resData.expiresIn,
          resData.idToken)
      })
    )
  }

  autoLogin(){
    const userDataString = localStorage.getItem('userData');
    if(!userDataString){
      return;
     }


  const userData:{
    email:string;
    id:string;
    _token:string;
    _tokenExpirationDate:string

  }= JSON.parse(userDataString);



  const loadedUser = new User(
    userData.email,
    userData.id,
    userData._token,
   new Date(userData._tokenExpirationDate)
    )

    console.log(loadedUser);


    if(loadedUser.token){

      this.user.next(loadedUser)
      const expirationDuration = new Date(userData._tokenExpirationDate).getTime()-new Date().getTime()
      this.autoLogOut(expirationDuration);
    }
  }

  logout(){
    this.user.next(null)
    this.router.navigate(['/auth'])//ridirect to auth page after logout, remember 'private router:Router' in the constructor
    localStorage.removeItem('userData');
    if(this.tokenExpirationTimer){
      clearTimeout(this.tokenExpirationTimer)
    }
    this.tokenExpirationTimer = null
  }

  autoLogOut(expirationDuration: number){
    console.log(expirationDuration);
    this.tokenExpirationTimer = setTimeout(()=>{
      this.logout()
    },expirationDuration)

  }

  private handleAuthentication(email:string,token:string,expiresIn:number,userId:string ){
    const expirationDate = new Date (new Date().getTime()+ expiresIn*1000)
        const user = new User(
         email,
          userId,
         token,
          expirationDate
          );
          this.user.next(user)
          this.autoLogOut(expiresIn*1000)
          localStorage.setItem('userData',JSON.stringify(user))
  }

  private handleError(errorRes:HttpErrorResponse){
    let errorMessage = 'An unknown error occured';
    if(!errorRes.error || !errorRes.error.error){
      return throwError(errorMessage)
    }
    switch(errorRes.error.error.message){
    case 'EMAIL_EXISTS':
      errorMessage = 'This email exists already';
      break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'This email does not exist'
        break;
        case 'INVALID_PASSWORD':
        errorMessage = 'This password is not correct'
        break;
  }
  return throwError(errorMessage)
  }

}





