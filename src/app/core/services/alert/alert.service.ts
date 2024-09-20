import { inject, Injectable } from '@angular/core';
import { ALERT_BUTTONS } from '@constants/alert-buttons.constant';
import { AlertController } from '@ionic/angular';
import { AlertModel } from '@models/alert.model';

@Injectable({
  providedIn: 'root',
})
export class AlertService {

  private alertController: AlertController = inject(AlertController);

  /**
   * presentAlert Show Alert
   * @param config AlertModel by Alert
   */
  async presentAlert(config: AlertModel) {
    const buttons = [];

    if (config.primaryButton) {
      buttons.push(
        ALERT_BUTTONS.primaryButton(
          config.primaryButton.text,
          config.primaryButton.role,
          config.primaryButton.color,
          config.primaryButton.handler
        )
      );
    }

    if (config.secondaryButton) {
      buttons.push(
        ALERT_BUTTONS.secondaryButton(
          config.secondaryButton.text,
          config.secondaryButton.role,
          config.secondaryButton.color,
          config.secondaryButton.handler
        )
      );
    }

    const alert = await this.alertController.create({
      header: config.header,
      message: config.message,
      buttons: buttons.length > 0 ? buttons : ['OK']
    });

    await alert.present();
  }

}
