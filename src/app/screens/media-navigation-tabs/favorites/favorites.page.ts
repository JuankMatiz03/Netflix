import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { UserService } from '@services/user/user.service';
import { UserModel } from '@models/user.model';
import { catchError, map, Observable, of, Subject, takeUntil } from 'rxjs';
import { UserStateService } from '@services/user-state/user-state.service';
import { MoviesModel } from '@models/movies.model';
import { SearchAndMoviesComponent } from '@components/search-and-movies/search-and-movies.component';
import { NavController } from '@ionic/angular';
import { ROUTES_ROOT } from '@constants/routes.constant';
import { AlertService } from '@services/alert/alert.service';
import { STRINGS } from '@constants/strings.constants';
import { TypeButtonRole } from 'app/shared/enums/type-button.enum';
import { ColorButton } from 'app/shared/enums/color-button.enum';
import { NoDataComponent } from "@components/no-data/no-data.component";

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    SearchAndMoviesComponent,
    NoDataComponent
]
})
export class FavoritesPage implements OnInit {

  private navController: NavController = inject(NavController);

  private userService: UserService = inject(UserService);

  private userState: UserStateService = inject(UserStateService);

  private alertService: AlertService = inject(AlertService);

  private destroy$ = new Subject<void>();

  user$: Observable<UserModel> | undefined;

  movies: MoviesModel[] = [];

  /**
   * ngOnInit
   */
  async ngOnInit() {
    this.loadUser();
  }

  /**
   * loadUser
   */
  async loadUser() {
    const user = await this.userState.getUser();

    this.userService.getUserById(user?.id as string)
      .pipe(
        takeUntil(this.destroy$),
        map((user) => user as UserModel),
        catchError((err) => {
          this.presentAlertError(err.message);
          return of(null);
        }),
      ).subscribe((user)  => {
        this.handleSubscribe(user!);
    });
  }

  /**
   * handleSubscribe
   * @param user user model
   */
  async handleSubscribe(user: UserModel){
    await this.userState.setUser(user!);
    this.movies = user!.favorites;

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
   * presentAlertError
   * @param text text
   */
  async presentAlertError(text: string) {
    await this.alertService.presentAlert({
      header: text,
      primaryButton: {
        text: STRINGS.FAVORITES.BUTTON_PRIMARY,
        role: TypeButtonRole.CONFIRM,
        color: ColorButton.PRIMARY,
      }
    });
  }
}


