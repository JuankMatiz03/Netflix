import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton } from '@ionic/angular/standalone';
import { AuthService } from '@services/auth/auth-service.service';
import { ROUTES_ROOT } from '@constants/routes.constant';
import { NavController } from '@ionic/angular';
import { UserStateService } from '@services/user-state/user-state.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [
    IonButton,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule
  ]
})
export class ProfilePage implements OnInit  {

  private userState: UserStateService = inject(UserStateService);

  private authService: AuthService = inject(AuthService);

  private navController: NavController = inject(NavController);

  userName: string = "";

  constructor() { }

  /**
   * ngOnInit
   */
  ngOnInit(): void {
    this.getProfile();
  }

  /**
   * getProfile
   */
  async getProfile() {
    const user = await this.userState.getUser();
    this.userName = user?.name ?? ""
  }

  /**
   * getWelcomeMessage
   * @returns welcome message
   */
  getWelcomeMessage(): string {
    const hour = new Date().getHours();
    if (hour < 12) {
      return 'Good morning';
    } else if (hour < 18) {
      return 'Good afternoon';
    } else {
      return 'Good night';
    }
  }

  /**
   * logout logout user
   */
  logout() {
    this.authService.logout();
    this.navController.navigateForward([`${ROUTES_ROOT.AUTH}/${ROUTES_ROOT.LOGIN}`]);
  }
}
