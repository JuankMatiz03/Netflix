import { AlertService } from './../../../core/services/alert/alert.service';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { catchError, finalize, map, takeUntil } from 'rxjs/operators';
import { of, Subject } from 'rxjs';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonLabel,
  IonText,
  IonItem,
  IonButton,
  IonInput,
  IonInputPasswordToggle,
  IonAlert,
} from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular';
import { AuthService } from '@services/auth/auth-service.service';
import { LoadingService } from '@services/loading/loading.service';
import { ROUTES_ROOT } from '@constants/routes.constant';
import { STRINGS } from '@constants/strings.constants';
import { TypeButtonRole } from 'app/shared/enums/type-button.enum';
import { ColorButton } from 'app/shared/enums/color-button.enum';
import { UserModel } from '@models/user.model';
import { User, UserCredential } from 'firebase/auth';
import { UserStateService } from '@services/user-state/user-state.service';
import { UserService } from '@services/user/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    IonInput,
    IonButton,
    IonItem,
    IonText,
    IonLabel,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonAlert,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonInputPasswordToggle
  ]
})
export class LoginPage implements OnDestroy, OnInit{

  private authService: AuthService = inject(AuthService);

  private navController: NavController = inject(NavController);

  private loadingService: LoadingService = inject(LoadingService);

  private alertService: AlertService = inject(AlertService);

  private userState: UserStateService = inject(UserStateService);

  private userService: UserService = inject(UserService);

  private destroy$ = new Subject<void>();

  form: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  constructor() {
  }

  /**
   * ngOnInit
   */
  async ngOnInit() {
    await this.userState.clearUser();
  }

  /**
   * ngOnDestroy
   */
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * onLogin login user
   * @returns auth
   */
  async onLogin() {
    if (!this.form.valid) {
      return;
    }

    const { email, password } = this.form.getRawValue();

    await this.loadingService.show(STRINGS.LOGIN.LOADING);

    this.authService.login(email, password).pipe(
      takeUntil(this.destroy$),
      map((user) => user as UserCredential),
      catchError((err) => {
        this.presentAlertError(err.message);
        return of(null);
      }),
      finalize(() => this.loadingService.hide())
    ).subscribe(user => {
      if (user && user) {
        this.getUserById(user.user.uid);
      }
    });
  }

  /**
   * getUserById
   * @param uid id user
   */
  getUserById(uid: string) {
    this.userService.getUserById(uid).subscribe(user => {
      this.handlerSubscribe(user!)
    });
  }

  /**
   * handlerSubscribe
   * @param user user model
   */
  async handlerSubscribe(user: UserModel) {
    await this.userState.setUser(user);
    this.form.reset();
    this.goToHome();
  }

  /**
   * goToHome
   */
  goToHome() {
    this.navController.navigateForward([`${ROUTES_ROOT.MEDIA_NAVIGATION}/${ROUTES_ROOT.HOME}`]);
  }

  /**
   * goToRegister
   */
  goToRegister() {
    this.navController.navigateForward([`${ROUTES_ROOT.AUTH}/${ROUTES_ROOT.REGISTER}`]);
  }

  /**
   * goToRecoverPassword
   */
  goToRecoverPassword() {
    this.navController.navigateForward([`${ROUTES_ROOT.AUTH}/${ROUTES_ROOT.PASSWORD_RECOVERY}`]);
  }

  /**
   * presentAlertError
   * @param text text
   */
  async presentAlertError(text: string) {
    await this.alertService.presentAlert({
      header: text,
      primaryButton: {
        text: STRINGS.LOGIN.BUTTON_PRIMARY,
        role: TypeButtonRole.CONFIRM,
        color: ColorButton.PRIMARY,
        handler: () => {
          this.goToRecoverPassword()
        }
      },
      secondaryButton: {
        text: STRINGS.LOGIN.BUTTON_SECONDARY,
        role: TypeButtonRole.CANCEL,
        color: ColorButton.PRIMARY,
      }
    });
  }
}
