import { Injectable } from '@angular/core';
import {
  Firestore,
  collectionData,
  collection,
  docData,
  doc,
  setDoc,
  getDoc,
  onSnapshot
} from '@angular/fire/firestore';
import { MoviesModel } from '@models/movies.model';
import { Observable, from, forkJoin, of } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  constructor(private firestore: Firestore) {}

  /**
   * getMovies
   * @returns movies
   */
  getMovies(): Observable<any[]> {
    const moviesCollection = collection(this.firestore, 'movies');

    return new Observable(observer => {
      const unsubscribe = onSnapshot(moviesCollection, async (snapshot) => {
        const movies = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const movieDetailsPromises = movies.map(async (movie: any) => {
          const categories = await this.getReferencedData(movie.categories);
          const cast = await this.getReferencedData(movie.cast);
          return {
            ...movie,
            categories,
            cast
          };
        });

        try {
          const moviesWithDetails = await Promise.all(movieDetailsPromises);
          observer.next(moviesWithDetails);
        } catch (error) {
          observer.error(error);
        }
      }, error => observer.error(error));

      return () => unsubscribe();
    });
  }

  /**
   * getMovieDetails
   * @param id id movie
   * @returns movie by id
   */
  getMovieDetails(id: string): Observable<any> {
    const movieDoc = doc(this.firestore, `movies/${String(id)}`);
    return from(getDoc(movieDoc)).pipe(
      switchMap(docSnap => {
        if (docSnap.exists()) {
          const movie = docSnap.data() as MoviesModel;

          const cast$ = from(this.getReferencedData(movie.cast));
          const categories$ = from(this.getReferencedData(movie.categories));

          return forkJoin([cast$, categories$]).pipe(
            map(([cast, categories]) => ({
              ...movie,
              id: docSnap.id,
              cast,
              categories
            }))
          );
        } else {
          return of(undefined);
        }
      }),
      catchError(error => {
        console.error("Error fetching movie:", error);
        return of(undefined);
      })
    );
  }

  /**
   * get reference
   * @param references references
   * @returns reference collection
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
          return getDoc(docRef).then(doc => doc.data());
        });
      return Promise.all(refPromises);
    }

    if (references.path) {
      const docRef = doc(this.firestore, references.path);
      return getDoc(docRef).then(doc => [doc.data()]);
    }

    return Promise.resolve([]);
  }
}
