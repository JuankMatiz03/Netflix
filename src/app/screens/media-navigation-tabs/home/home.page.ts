import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirestoreService } from '@services/firestore/firestore.service';
import { AuthService } from '@services/auth/auth-service.service';
import { NavController } from '@ionic/angular';
import { ROUTES_ROOT } from '@constants/routes.constant';
import { Subject, takeUntil } from 'rxjs';
import { MoviesModel } from '@models/movies.model';
import { SearchAndMoviesComponent } from "@components/search-and-movies/search-and-movies.component";
import { IonContent } from "@ionic/angular/standalone";
import { NoDataComponent } from "@components/no-data/no-data.component";
import { SlidesMoviesComponent } from "@components/slides-movies/slides-movies.component";

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    CommonModule,
    SearchAndMoviesComponent,
    NoDataComponent,
    SlidesMoviesComponent
]
})
export class HomePage implements OnInit, OnDestroy {

  private firestoreService: FirestoreService = inject(FirestoreService);

  private authService: AuthService = inject(AuthService);

  private navController: NavController = inject(NavController);

  private destroy$ = new Subject<void>();

  movies: MoviesModel[] = [];

  searchTerm: string = '';

  constructor() { }

  /**
   * ngOnInit
   */
  ngOnInit() {
    this.getMovies();
  }

  /**
   * ngOnDestroy
   */
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * getMovies
   */
  getMovies() {
    this.firestoreService.getMovies()
    .pipe(
      takeUntil(this.destroy$),
    )
    .subscribe(movies => {
      if (movies) {
        this.movies = movies;
      }
    });
  }

  /**
   * movieSelected
   * @param movie movie
   */
  movieSelected(movie: MoviesModel) {
    this.navController.navigateForward([
      `${ROUTES_ROOT.MEDIA_NAVIGATION}/${ROUTES_ROOT.MOVIE_DETAIL}/${movie.id}`
    ]);
  }

  /**
   * logout
   */
  logout() {
    this.authService.logout();
    this.navController.navigateForward([`${ROUTES_ROOT.AUTH}/${ROUTES_ROOT.LOGIN}`]);
  }
}
