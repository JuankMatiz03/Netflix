import { Component, EnvironmentInjector, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonThumbnail,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonIcon,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonList,
  IonItem,
  IonLabel,
  IonSkeletonText
} from '@ionic/angular/standalone';
import { MoviesModel } from '@models/movies.model';
import { FirestoreService } from '@services/firestore/firestore.service';
import { catchError, of, Subject, takeUntil } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { addIcons } from 'ionicons';
import { star, heart, time } from 'ionicons/icons';
import { UserService } from '@services/user/user.service';
import { UserStateService } from '@services/user-state/user-state.service';
import { UserModel } from '@models/user.model';
import { AlertService } from '@services/alert/alert.service';
import { STRINGS } from '@constants/strings.constants';
import { TypeButtonRole } from 'app/shared/enums/type-button.enum';
import { ColorButton } from 'app/shared/enums/color-button.enum';
import { NavController } from '@ionic/angular';
import { ROUTES_ROOT } from '@constants/routes.constant';

@Component({
  selector: 'app-movie-detail',
  templateUrl: './movie-detail.page.html',
  styleUrls: ['./movie-detail.page.scss'],
  standalone: true,
  imports: [
    IonSkeletonText,
    IonLabel,
    IonItem,
    IonList,
    IonCol,
    IonRow,
    IonGrid,
    IonButton,
    IonIcon,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonThumbnail
  ]
})
export class MovieDetailPage implements OnInit {

  private navController: NavController = inject(NavController);

  private alertService: AlertService = inject(AlertService);

  private userState: UserStateService = inject(UserStateService);

  private userService: UserService = inject(UserService);

  public environmentInjector = inject(EnvironmentInjector);

  private route: ActivatedRoute = inject(ActivatedRoute);

  private firestoreService: FirestoreService = inject(FirestoreService);

  private destroy$ = new Subject<void>();

  movie: MoviesModel | undefined;

  constructor() {
    addIcons({heart,time,star});
  }

  /**
   * ngOnInit
   */
  ngOnInit() {
    this.routeParams();
  }

  /**
   * routeParams
   */
  routeParams() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.getMovieById(id!);
    });
  }

  /**
   * getMovieById get movie by id
   * @param id id movie
   */
  getMovieById(id: string) {
    this.firestoreService.getMovieDetails(id)
    .pipe(
      takeUntil(this.destroy$),
    )
    .subscribe(movie => {
      if (movie) {
        this.movie = movie;
      }
    });
  }

  /**
   * addToFavorites
   */
  async addToFavorites() {
    const user: UserModel | null = await this.userState.getUser();

    this.userService.addFavorite(user?.id ?? "", this.movie?.id ?? "")
    .pipe(
      takeUntil(this.destroy$),
      catchError((err) => {
        this.presentAlertError(err.message);
        return of(null);
      }),
    ).subscribe(() => {
      this.presentAlertSuccess(true);
    });
  }

  /**
   * addToWatchLater
   */
  async addToWatchLater() {
    const user: UserModel | null = await this.userState.getUser();

    this.userService.addToWatchLater(user?.id ?? "", this.movie?.id ?? "")
    .pipe(
      takeUntil(this.destroy$),
      catchError((err) => {
        this.presentAlertError(err.message);
        return of(null);
      }),
    ).subscribe(() => {
      this.presentAlertSuccess(false);
    });
  }

  /**
   * goToFavorites
   */
  goToFavorites() {
    this.navController.navigateForward([`${ROUTES_ROOT.MEDIA_NAVIGATION}/${ROUTES_ROOT.FAVORITES}`])
  }

  /**
   * goWatchLater
   */
  goWatchLater() {
    this.navController.navigateForward([`${ROUTES_ROOT.MEDIA_NAVIGATION}/${ROUTES_ROOT.WATCH_LATER}`])
  }

  /**
   * presentAlertSuccess
   * @param isFavorite boolean validate alert
   */
  async presentAlertSuccess(isFavorite: boolean) {
    await this.alertService.presentAlert({
      header: isFavorite
        ? STRINGS.DETAIL_MOVIE.SUCCESS_MODAL_TITLE_FAVORITE
        : STRINGS.DETAIL_MOVIE.SUCCESS_MODAL_TITLE_WATCH,
      primaryButton: {
        text: STRINGS.DETAIL_MOVIE.BUTTON_PRIMARY,
        role: TypeButtonRole.CONFIRM,
        color: ColorButton.PRIMARY,
        handler: () => {
          if (isFavorite) {
            this.goToFavorites();
          }else {
            this.goWatchLater();
          }
        }
      },
    });
  }

  /**
   * presentAlertError
   * @param text text
   */
  async presentAlertError(text: string) {
    await this.alertService.presentAlert({
      header: text,
      primaryButton: {
        text: STRINGS.DETAIL_MOVIE.BUTTON_PRIMARY,
        role: TypeButtonRole.CONFIRM,
        color: ColorButton.PRIMARY,
      }
    });
  }

  /**
   * getStars
   * @param rating rating
   * @returns rating
   */
  getStars(rating?: number) {
    return rating ? Array(Math.floor(rating)).fill(0) : [];
  }

}
