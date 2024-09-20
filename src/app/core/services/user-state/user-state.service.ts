import { Injectable } from '@angular/core';
import { UserModel } from '@models/user.model';
import { BehaviorSubject, Observable, from, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class UserStateService {
  private userSubject = new BehaviorSubject<UserModel | null>(null);

  private isStorageReady: Promise<void>;

  user$: Observable<UserModel | null> = this.userSubject.asObservable();

  constructor(private storage: Storage) {
    this.isStorageReady = this.init();
  }

  /**
   * init state
   */
  private async init(): Promise<void> {
    try {
      await this.storage.create();
      const storedUser = await this.storage.get('user');
      if (storedUser) {
        this.userSubject.next(storedUser);
      }
    } catch (error) {
      console.error('Failed to initialize storage', error);
    }
  }

  /**
   * set user state
   * @param user user
   */
  async setUser(user: UserModel): Promise<void> {
    await this.isStorageReady;
    try {
      await this.storage.set('user', JSON.stringify(user));
      this.userSubject.next(user);
    } catch (error) {
      console.error('Failed to set user in storage', error);
    }
  }

  /**
   * getUser
   * @returns user state
   */
  async getUser(): Promise<UserModel | null> {
    await this.isStorageReady;
    try {
      const user = await this.storage.get('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Failed to get user from storage', error);
      return null;
    }
  }

  /**
   * clear user state
   */
  async clearUser(): Promise<void> {
    await this.isStorageReady;
    try {
      await this.storage.remove('user');
      this.userSubject.next(null);
    } catch (error) {
      console.error('Failed to clear user from storage', error);
    }
  }
}
