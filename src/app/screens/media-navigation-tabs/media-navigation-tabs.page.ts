import { Component, EnvironmentInjector, inject } from '@angular/core';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  home,
  heartCircleOutline,
  pauseCircleOutline,
  personCircleOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-media-navigation-tabs',
  templateUrl: './media-navigation-tabs.page.html',
  styleUrls: ['./media-navigation-tabs.page.scss'],
  standalone: true,
  imports: [
    IonTabs,
    IonTabBar,
    IonTabButton,
    IonIcon,
    IonLabel
  ],
})
export class MediaNavigationTabsComponent {

  public environmentInjector = inject(EnvironmentInjector);

  constructor() {
    addIcons({
      home,
      heartCircleOutline,
      pauseCircleOutline,
      personCircleOutline
    });
  }
}
