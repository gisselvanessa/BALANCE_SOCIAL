import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { UserModel } from '@app/models/user';

@Injectable({ providedIn: 'root' })
export class LoginService {
  private userSubject: BehaviorSubject<UserModel | null>;
  public user: Observable<UserModel | null>;

  constructor(
    private router: Router,
    private http: HttpClient
  ) {
    this.userSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('userJakayBalance')!));
    this.user = this.userSubject.asObservable();
  }

  public get userValue() {
    
    return this.userSubject.value;
  }

  login(username: string, pass: string) {
    const data = {
      "email": username,
      "password": pass
    }
    return this.http.post<UserModel>(`${environment.apiUrl}/user/login/`, data)
      .pipe(map(user => {
        localStorage.setItem('userJakayBalance', JSON.stringify(user));
        this.userSubject.next(user);
        return user;
      }));
  }

  logout() {
    // remove user from local storage and set current user to null
    localStorage.removeItem('userJakayBalance');
    this.userSubject.next(null);
    this.router.navigate(['/authentication/side-login']);
  }

  // refreshToken(refreshToken: any): Observable<any> {
    
  //   return this.http.post<any>(`${environment.apiUrl}/user/login/refresh/`,  refreshToken )
  //     .pipe(
  //       tap(user => {
  //         localStorage.setItem('userJakayBalance', JSON.stringify(user.access));
  //         this.userSubject.next(user);
  //         return user;
  //       }),
  //       catchError(error => {
  //       // Handle the error, e.g., log it or propagate it further
  //       console.error('Error refreshing token:', error);
  //       throw error;
  //     }));
  // }

  refreshToken(refreshToken: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/user/login/refresh/`, refreshToken)
      .pipe(
        tap(response => {
          // Check if the response has the "access" property
          if (response && response.access) {

            // delete response.refresh;
            // Retrieve the existing user data from local storage
            const storedUserData = localStorage.getItem('userJakayBalance');
            
            // Parse the stored user data or default to an empty object if null
            const existingUserData = storedUserData ? JSON.parse(storedUserData) : {};
  
            // Update only the "access" property in the existing user data
            existingUserData.access = response.access;
            delete existingUserData.refresh;

  
            // Save the updated user data back to local storage
            localStorage.setItem('userJakayBalance', JSON.stringify(existingUserData));
  
            // Notify subscribers with the updated user data
            this.userSubject.next(existingUserData);
          }
  
          return response;
        }),
        catchError(error => {
          // Handle the error, e.g., log it or propagate it further
          console.error('Error refreshing token:', error);
          throw error;
        })
      );
  }
  
  

}
