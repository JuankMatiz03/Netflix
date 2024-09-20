import { Component, Input, OnInit, CUSTOM_ELEMENTS_SCHEMA, signal, ElementRef, ViewChild, AfterViewInit, inject } from '@angular/core';
import { MoviesModel } from '@models/movies.model';
import { CategoriesModel } from '@models/categories.model';
import { groupBy } from 'lodash';
import { BehaviorSubject, Observable } from 'rxjs';
import { debounceTime, map, tap } from 'rxjs/operators';
import { IonContent, IonCardSubtitle, IonCardTitle, IonCardHeader, IonCard } from "@ionic/angular/standalone";
import { SwiperOptions } from 'swiper/types';
import { register as registerSwiperElements, SwiperContainer } from 'swiper/element/bundle';
import { CommonModule } from '@angular/common';
import { SearchSlidesPipe } from "@pipes/search-slides.pipe";
import { NavController } from '@ionic/angular';
import { ROUTES_ROOT } from '@constants/routes.constant';
import { FormsModule } from '@angular/forms';

registerSwiperElements();
@Component({
  selector: 'app-slides-movies',
  templateUrl: './slides-movies.component.html',
  styleUrls: ['./slides-movies.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonContent,
    SearchSlidesPipe
],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SlidesMoviesComponent implements OnInit, AfterViewInit {

  @ViewChild('swiperContainer') swiperContainer: any;

  @Input() set moviesInput(movies: MoviesModel[]) {
    this.moviesSubject.next(movies);
    this.loading.next(true);
  }

  private navController: NavController = inject(NavController);

  private loading = new BehaviorSubject<boolean>(true);

  private moviesSubject = new BehaviorSubject<MoviesModel[]>([]);

  loading$: Observable<boolean> = this.loading.asObservable();

  swiperElement = signal<SwiperContainer | null>(null);

  groupedMovies$: Observable<{ category: string, movies: MoviesModel[] }[]> = new Observable();

  searchTerm: string = '';

  swiperConfig: SwiperOptions = {
    autoplay: true,
    pagination: {
      el: '.swiper-pagination',
      clickable: true
    },
    navigation: true,
    loop: true,
    slidesPerView: 3,
    spaceBetween: 30,
  };

  constructor() { }

  /**
   * ngOnInit
   */
  ngOnInit() {
    this.groupedMovies$ = this.moviesSubject.pipe(
      debounceTime(1000),
      tap(() => this.loading.next(false)),
      map(movies => {
        const grouped = groupBy(movies, (movie) => movie.categories.map(cat => cat.name).join(', '));
        return Object.keys(grouped).map(category => ({
          category,
          movies: grouped[category]
        }));
      })
    );
  }

  /**
   * onMovieClick
   * @param movie movie
   */
  onMovieClick(movie: MoviesModel) {
    this.navController.navigateForward([
      `${ROUTES_ROOT.MEDIA_NAVIGATION}/${ROUTES_ROOT.MOVIE_DETAIL}/${movie.id}`
    ]);
  }

  /**
   * ngAfterViewInit
   */
  ngAfterViewInit() {
    if (this.swiperContainer) {
      const swiper = this.swiperContainer.nativeElement;
      Object.assign(swiper, this.swiperConfig);
      swiper.initialize();
    }
  }
}


