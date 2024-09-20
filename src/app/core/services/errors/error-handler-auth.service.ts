import { Injectable } from '@angular/core';
import { of, throwError } from 'rxjs';
import { STRINGS } from '@constants/strings.constants';
import { FirebaseError } from 'firebase/app';


@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerAuthService {

  /**
   * handleError manage errors
   * @param error error
   * @param operation operation
   * @returns message error
   */
  handleError(error: FirebaseError, operation: string = 'Operation') {
    let errorMessage = STRINGS.ERROR_STRINGS.UNKNOWN_ERROR;

    switch (error.code) {
      case 'auth/invalid-credential':
      case 'auth/wrong-password':
        errorMessage = STRINGS.ERROR_STRINGS.USER_NOT_FOUND;
        break;
      case 'auth/email-already-in-use':
        errorMessage = STRINGS.ERROR_STRINGS.EMAIL_ALREADY_IN_USE;
        break;
      case 'auth/invalid-email':
        errorMessage = STRINGS.ERROR_STRINGS.EMAIL_INVALID;
        break;
      case 'auth/network-request-failed':
      case'auth/internal-error':
        errorMessage = STRINGS.ERROR_STRINGS.NETWORK_REQUEST_FILED;
        break;
      case 'auth/weak-password':
        errorMessage = STRINGS.ERROR_STRINGS.INVALID_PASSWORD_LENGTH;
        break
      default:
        errorMessage = STRINGS.ERROR_STRINGS.UNKNOWN_ERROR;
        break;
    }

    console.error(`${operation} failed: ${errorMessage}`, error);
    return throwError(() => new Error(errorMessage));
  }
}
