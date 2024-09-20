import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MoviesModel } from '@models/movies.model';
import { BehaviorSubject, debounceTime, Observable, tap } from 'rxjs';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonButton,
  IonSearchbar,
  IonSkeletonText
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { SearchPipe } from "../../pipes/search.pipe";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-and-movies',
  templateUrl: './search-and-movies.component.html',
  styleUrls: ['./search-and-movies.component.scss'],
  standalone: true,
  imports: [
    IonSkeletonText,
    IonSearchbar,
    IonButton,
    IonCardTitle,
    IonCardHeader,
    IonCard,
    IonCol,
    IonRow,
    IonGrid,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    SearchPipe,
    FormsModule
  ]
})
export class SearchAndMoviesComponent {

  @Input() set moviesInput(movies: MoviesModel[]) {
    this.movies.next(movies);

    this.loading.next(true);

    this.movies.pipe(
      debounceTime(1000),
      tap(() => this.loading.next(false))
    ).subscribe();
  }

  @Output() movieSelected = new EventEmitter<MoviesModel>();

  private movies = new BehaviorSubject<MoviesModel[]>([]);

  private loading = new BehaviorSubject<boolean>(true);

  movies$: Observable<MoviesModel[]> = this.movies.asObservable();

  loading$: Observable<boolean> = this.loading.asObservable();

  searchTerm: string = '';

  constructor() { }

  /**
   * onMovieClick
   * @param movie movie
   */
  onMovieClick(movie: MoviesModel) {
    this.movieSelected.emit(movie);
  }
}
