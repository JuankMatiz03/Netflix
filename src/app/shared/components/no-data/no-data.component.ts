import { IonTitle, IonIcon } from '@ionic/angular/standalone';
import { Component } from '@angular/core';

@Component({
  selector: 'app-no-data',
  template: `
    <div class="no-data-container">
      <ion-icon name="sad-outline" class="no-data-icon"></ion-icon>
      <h2 class="no-data-title">No Movies Available</h2>
      <p class="no-data-message">It seems you have no movies in your list.</p>
    </div>
  `,
  styles: [`
    .no-data-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      text-align: center;
    }

    .no-data-icon {
      font-size: 64px;
      color: var(--ion-color-primary);
      margin-bottom: 16px;
    }

    .no-data-title {
      font-size: 24px;
      font-weight: bold;
      color: var(--ion-color-dark);
      margin-bottom: 8px;
    }

    .no-data-message {
      font-size: 16px;
      color: var(--ion-color-medium);
    }
  `],
  standalone: true,
  imports: [
    IonTitle,
    IonIcon
  ]
})
export class NoDataComponent {}
