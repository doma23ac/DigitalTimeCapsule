import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private user: any = null;

  setUser(user: any): void {
    this.user = user;
  }

  getUser(): any {
    return this.user;
  }

  clearUser(): void {
    this.user = null;
  }
}

