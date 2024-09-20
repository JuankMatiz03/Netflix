import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MediaNavigationTabsPage } from './media-navigation-tabs.page';

describe('MediaNavigationTabsPage', () => {
  let component: MediaNavigationTabsPage;
  let fixture: ComponentFixture<MediaNavigationTabsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MediaNavigationTabsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
