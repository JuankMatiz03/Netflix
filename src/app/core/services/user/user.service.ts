import { Injectable } from '@angular/core';
import {
  Firestore,
  collectionData,
  collection,
  docData,
  doc,
  setDoc,
  getDoc,
  deleteDoc,
  updateDoc,
  arrayUnion,
  onSnapshot
} from '@angular/fire/firestore';
import { UserModel } from '@models/user.model';
import { forkJoin, from, Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private usersCollection = collection(this.firestore, 'users');

  constructor(private firestore: Firestore) {}

  /**
   * create user
   * @param user user
   * @returns user create
   */
  createUser(user: UserModel): Observable<void> {
    const userDocRef = doc(this.usersCollection, user.id);
    return from(setDoc(userDocRef, user));
  }

  /**
   * updateUser
   * @param id id
   * @param user user user model
   * @returns
   */
  updateUser(id: string, user: Partial<UserModel>): Observable<void> {
    const userDocRef = doc(this.usersCollection, id);
    return from(updateDoc(userDocRef, { ...user }));
  }

  /**
   * addFavorite favorite movies
   * @param userId userId
   * @param favoriteItemId favoriteItemId
   * @returns success o error
   */
  addFavorite(userId: string, favoriteItemId: string): Observable<void> {
    const userDocRef = doc(this.firestore, `users/${String(userId)}`);
    const movieRef = doc(this.firestore, `movies/${String(favoriteItemId)}`);

    return from(getDoc(userDocRef)).pipe(
      switchMap(docSnap => {
        if (docSnap.exists()) {
          const userData = docSnap.data();
          const favorites = userData?.['favorites'] || [];

          const isAlreadyFavorite = favorites.some((ref: any) => ref.path === movieRef.path);

          if (isAlreadyFavorite) {
            console.log('Favorite item already exists in the list.');
            return of(undefined);
          } else {
            return from(updateDoc(userDocRef, {
              favorites: arrayUnion(movieRef)
            }));
          }
        } else {
          console.error('User document does not exist.');
          return of(undefined);
        }
      }),
      catchError(error => {
        console.error("Error adding favorite:", error);
        return of(undefined);
      })
    );
  }


  /**
   * addFavorite watch later movies
   * @param userId userId
   * @param watchLaterItemId favoriteItemId
   * @returns success o error
   */
  addToWatchLater(userId: string, watchLaterItemId: string): Observable<void> {
    const userDocRef = doc(this.firestore, `users/${String(userId)}`);
    const movieRef = doc(this.firestore, `movies/${String(watchLaterItemId)}`);

    return from(getDoc(userDocRef)).pipe(
      switchMap(docSnap => {
        if (docSnap.exists()) {
          const userData = docSnap.data();
          const watchLater = userData?.['watchLater'] || [];

          const isAlreadyFavorite = watchLater.some((ref: any) => ref.path === movieRef.path);

          if (isAlreadyFavorite) {
            console.log('watch Later item already exists in the list.');
            return of(undefined);
          } else {
            return from(updateDoc(userDocRef, {
              watchLater: arrayUnion(movieRef)
            }));
          }
        } else {
          console.error('User document does not exist.');
          return of(undefined);
        }
      }),
      catchError(error => {
        console.error("Error adding watchLater:", error);
        return of(undefined);
      })
    );
  }

  /**
   * getUserById get user by id
   * @param id id
   * @returns user by id
   */
  getUserById(id: string): Observable<UserModel | undefined> {
    const userDocRef = doc(this.firestore, `users/${String(id)}`);

    return new Observable(observer => {
      const unsubscribe = onSnapshot(userDocRef, async (docSnap) => {
        if (docSnap.exists()) {
          const user = docSnap.data() as UserModel;

          const favorites$ = from(this.getReferencedData(user.favorites || []));
          const watchLater$ = from(this.getReferencedData(user.watchLater || []));

          forkJoin([favorites$, watchLater$]).pipe(
            map(([favorites, watchLater]) => ({
              ...user,
              favorites,
              watchLater
            }))
          ).subscribe(
            updatedUser => observer.next(updatedUser),
            error => observer.error(error)
          );
        } else {
          observer.next(undefined);
        }
      }, error => observer.error(error));

      return () => unsubscribe();
    });
  }

  /**
   * getReferencedData
   * @param references references
   * @returns references
   */
  private getReferencedData(references: any): Promise<any[]> {
    if (!references) {
      return Promise.resolve([]);
    }

    if (Array.isArray(references)) {
      const refPromises = references
        .filter((ref: any) => ref && ref.path)
        .map((ref: any) => {
          const docRef = doc(this.firestore, ref.path);
          return getDoc(docRef).then(doc => {
            if (doc.exists()) {
              return { id: doc.id, ...doc.data() };
            }
            return null;
          });
        });

      return Promise.all(refPromises).then(results => results.filter(item => item !== null));
    }

    if (references.path) {
      const docRef = doc(this.firestore, references.path);
      return getDoc(docRef).then(doc => {
        if (doc.exists()) {
          return [{ id: doc.id, ...doc.data() }];
        }
        return [];
      });
    }

    return Promise.resolve([]);
  }

}
