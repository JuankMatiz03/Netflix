import { inject, Injectable } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  user,
  UserCredential,
  User
} from '@angular/fire/auth';
import { catchError, from, map, Observable, throwError } from 'rxjs';
import { ErrorHandlerAuthService } from '@services/errors/error-handler-auth.service';
import { ErrorHandlerAuthModel } from '@models/errorHandlerAuth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth: Auth = inject(Auth);

  private errorHandler: ErrorHandlerAuthService = inject(ErrorHandlerAuthService);

  constructor() {}

  /**
   * login login user
   * @param email email
   * @param password password
   * @returns auth
   */
  login(email: string, password: string): Observable<UserCredential | ErrorHandlerAuthModel> {
    return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
      map((userCredential: UserCredential) => userCredential),
      catchError((err) => this.errorHandler.handleError(err))
    );
  }

  /**
   * register register user
   * @param email email
   * @param password password
   * @returns auth
   */
  register(email: string, password: string): Observable<User | ErrorHandlerAuthModel> {
    return from(createUserWithEmailAndPassword(this.auth, email, password)).pipe(
      map((userCredential) => userCredential.user),
      catchError((err) => this.errorHandler.handleError(err))
    );
  }

  /**
   * resetPassword reset password
   * @param email email
   * @returns auth
   */
  resetPassword(email: string): Observable<void | ErrorHandlerAuthModel> {
    return from(sendPasswordResetEmail(this.auth, email)).pipe(
      catchError((err) => {
        return this.errorHandler.handleError(err);
      })
    );
  }

  /**
   * getAuthState
   * @returns auth use bool
   */
  getAuthState(): Observable<User | null> {
    return user(this.auth);
  }

  /**
   * logout user
   * @returns void
   */
  logout(): Promise<void>{
    return this.auth.signOut();
  }
}
