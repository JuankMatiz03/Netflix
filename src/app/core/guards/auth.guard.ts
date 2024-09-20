import { CanActivateChildFn, Router } from '@angular/router';
import { Auth, user } from '@angular/fire/auth';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * AuthGuard
 * @param childRoute childRoute
 * @param state state
 * @returns bool validation
 */
export const AuthGuard: CanActivateChildFn = (childRoute, state): Observable<boolean> => {
  const auth = inject(Auth);
  const router = inject(Router);

  return user(auth).pipe(
    map((currentUser) => {
      if (currentUser) {
        return true;
      } else {
        router.navigate(['/login']);
        return false;
      }
    })
  );
};
