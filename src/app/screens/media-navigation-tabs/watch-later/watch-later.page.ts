import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonIcon, IonCardHeader, IonGrid } from '@ionic/angular/standalone';
import { UserService } from '@services/user/user.service';
import { UserModel } from '@models/user.model';
import { map, Observable, Subject, takeUntil } from 'rxjs';
import { UserStateService } from '@services/user-state/user-state.service';
import { MoviesModel } from '@models/movies.model';
import { SearchAndMoviesComponent } from '@components/search-and-movies/search-and-movies.component';
import { ROUTES_ROOT } from '@constants/routes.constant';
import { NavController } from '@ionic/angular';
import { NoDataComponent } from "@components/no-data/no-data.component";

@Component({
  selector: 'app-watch-later',
  templateUrl: './watch-later.page.html',
  styleUrls: ['./watch-later.page.scss'],
  standalone: true,
  imports: [IonGrid, IonCardHeader, IonIcon,
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
export class WatchLaterPage implements OnInit {

  private navController: NavController = inject(NavController);

  private userService: UserService = inject(UserService);

  private userState: UserStateService = inject(UserStateService);

  private destroy$ = new Subject<void>();

  user$: Observable<UserModel> | undefined;

  movies: MoviesModel[] = [];

  constructor() { }

  /**
   * ngOnInit
   */
  ngOnInit() {
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
      ).subscribe(async (user)  => {
        await this.userState.setUser(user);
        this.movies = user?.watchLater;
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
}
