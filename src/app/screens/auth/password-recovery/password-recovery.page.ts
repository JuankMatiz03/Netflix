import { Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonText, IonButton } from '@ionic/angular/standalone';
import { AuthService } from '@services/auth/auth-service.service';
import { ROUTES_ROOT } from '@constants/routes.constant';
import { NavController } from '@ionic/angular';
import { LoadingService } from '@services/loading/loading.service';
import { AlertService } from '@services/alert/alert.service';
import { catchError, finalize, of, Subject, takeUntil } from 'rxjs';
import { STRINGS } from '@constants/strings.constants';
import { TypeButtonRole } from 'app/shared/enums/type-button.enum';
import { ColorButton } from 'app/shared/enums/color-button.enum';

@Component({
  selector: 'app-password-recovery',
  templateUrl: './password-recovery.page.html',
  styleUrls: ['./password-recovery.page.scss'],
  standalone: true,
  imports: [
    IonButton,
    IonText,
    IonLabel,
    IonItem,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class PasswordRecoveryPage implements OnDestroy  {

  private authService: AuthService = inject(AuthService);

  private navController: NavController = inject(NavController);

  private loadingService: LoadingService = inject(LoadingService);

  private alertService: AlertService = inject(AlertService);

  private destroy$ = new Subject<void>();

  form: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  constructor() { }

  /**
   * ngOnDestroy
   */
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * onResetPassword
   * @returns reset
   */
  async onResetPassword() {
    if (!this.form.valid) {
      return;
    }

    const { email } = this.form.getRawValue();

    await this.loadingService.show(STRINGS.PASSWORD_RESET.LOADING);

    this.authService.resetPassword(email).pipe(
      takeUntil(this.destroy$),
      catchError((err) => {
        this.presentAlertError(err.message);
        return of(null);
      }),
      finalize(() => this.loadingService.hide())
    ).subscribe(() => {
      this.form.reset();
      this.presentAlertSuccess();
    });
  }

  /**
   * goToLogin
   */
  goToLogin() {
    this.navController.navigateForward([`${ROUTES_ROOT.AUTH}/${ROUTES_ROOT.LOGIN}`]);
  }

  /**
   * presentAlertError
   * @param text text
   */
  async presentAlertError(text: string) {
    await this.alertService.presentAlert({
      header: text,
      primaryButton: {
        text: STRINGS.PASSWORD_RESET.BUTTON_PRIMARY,
        role: TypeButtonRole.CONFIRM,
        color: ColorButton.PRIMARY,
      },
    });
  }

  /**
   * presentAlertSuccess
   */
  async presentAlertSuccess() {
    await this.alertService.presentAlert({
      header: STRINGS.PASSWORD_RESET.SUCCESS_HEADER,
      primaryButton: {
        text: STRINGS.PASSWORD_RESET.BUTTON_PRIMARY,
        role: TypeButtonRole.CONFIRM,
        color: ColorButton.PRIMARY,
        handler: () => {
          this.goToLogin();
        }
      },
    });
  }
}
