import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loading: HTMLIonLoadingElement | null = null;

  constructor(private loadingController: LoadingController) {}

  /**
   * show loading
   * @param message message
   */
  async show(message: string = 'Charging...') {
    if (!this.loading) {
      this.loading = await this.loadingController.create({
        message,
        spinner: 'circular',
        cssClass: 'red',
        showBackdrop: true,
        translucent: true
      });
      await this.loading.present();
    }
  }

  /**
   * hide loading
   */
  async hide() {
    if (this.loading) {
      await this.loading.dismiss();
      this.loading = null;
    }
  }
}
