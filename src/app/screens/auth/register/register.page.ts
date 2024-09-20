import { Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { catchError, finalize, map, of, Subject, takeUntil } from 'rxjs';
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
  IonInputPasswordToggle
} from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular';
import { AuthService } from '@services/auth/auth-service.service';
import { LoadingService } from '@services/loading/loading.service';
import { ROUTES_ROOT } from '@constants/routes.constant';
import { AlertService } from '@services/alert/alert.service';
import { STRINGS } from '@constants/strings.constants';
import { passwordsMatchValidator } from '@utils/password-match.validator';
import { TypeButtonRole } from 'app/shared/enums/type-button.enum';
import { ColorButton } from 'app/shared/enums/color-button.enum';
import { UserStateService } from '@services/user-state/user-state.service';
import { UserModel } from '@models/user.model';
import { User } from '@angular/fire/auth';
import { UserService } from '@services/user/user.service';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [
    IonInput,
    IonButton,
    IonText,
    IonLabel,
    IonItem,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonInputPasswordToggle,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class RegisterPage implements OnDestroy  {

  private authService: AuthService = inject(AuthService);

  private navController: NavController = inject(NavController);

  private loadingService: LoadingService = inject(LoadingService);

  private alertService: AlertService = inject(AlertService);

  private userState: UserStateService = inject(UserStateService);

  private userService: UserService = inject(UserService);

  private destroy$ = new Subject<void>();

  form: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
    confirmPassword: new FormControl('', Validators.required)
  }, { validators: passwordsMatchValidator() });

  constructor() { }

  /**
   * ngOnDestroy
   */
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * onRegister
   * @returns auth register
   */
  async onRegister() {
    if (!this.form.valid) {
      return;
    }

    const { name, email, password } = this.form.getRawValue();

    const newUser: UserModel = {
      name: name,
      email: email,
      favorites: [],
      watchLater: []
    }

    await this.loadingService.show(STRINGS.REGISTER.LOADING);

    this.authService.register(email, password).pipe(
      takeUntil(this.destroy$),
      map((user) => user as User),
      catchError((err) => {
        this.presentAlertError(err.message);
        return of(null);
      }),
      finalize(() => this.loadingService.hide())
    ).subscribe(user => {
      if (user && user.uid) {
        newUser.id = user.uid;
        this.handlerSubscribe(newUser);
      }
    });
  }

  /**
   * handlerSubscribe
   * @param user user model
   */
  async handlerSubscribe(user: UserModel) {
    await this.userState.setUser(user);
    this.createUserInCollection(user);
    this.form.reset();
    this.presentAlertSuccess();
  }

  /**
   * createUserInCollection
   * @param user userModel
   */
  createUserInCollection(user: UserModel) {
    this.userService.createUser(user);
  }

  /**
   * goToHome
   */
  goToHome() {
    this.navController.navigateForward([`${ROUTES_ROOT.MEDIA_NAVIGATION}/${ROUTES_ROOT.HOME}`]);
  }

  /**
   * goToLogin
   */
  goToLogin() {
    this.navController.navigateForward([`${ROUTES_ROOT.AUTH}/${ROUTES_ROOT.LOGIN}`]);
  }

  /**
   * handlerSecondaryButton
   */
  handlerSecondaryButton() {
    this.form.reset();
    this.goToLogin();
  }

  /**
   * presentAlertSuccess
   */
  async presentAlertSuccess() {
    await this.alertService.presentAlert({
      header: STRINGS.REGISTER.TITLE_MODAL,
      primaryButton: {
        text: STRINGS.REGISTER.BUTTON_TERTIARY,
        role: TypeButtonRole.CONFIRM,
        color: ColorButton.PRIMARY,
        handler: () => {
          this.goToHome();
        }
      },
    });
  }

  /**
   * presentAlertError
   * @param text text error
   */
  async presentAlertError(text: string) {
    await this.alertService.presentAlert({
      header: text,
      primaryButton: {
        text: STRINGS.REGISTER.BUTTON_PRIMARY,
        role: TypeButtonRole.CONFIRM,
        color: ColorButton.PRIMARY,
      },
      secondaryButton: {
        text: STRINGS.REGISTER.BUTTON_SECONDARY,
        role: TypeButtonRole.CANCEL,
        color: ColorButton.PRIMARY,
        handler: () => {
          this.handlerSecondaryButton();
        }
      }
    });
  }
}
