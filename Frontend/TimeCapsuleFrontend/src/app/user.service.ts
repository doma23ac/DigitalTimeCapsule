import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private user: any = null;

  setUser(user: any): void {
    this.user = {
      userId: user.userId,
      username: user.username,
      email: user.email
    };
    localStorage.setItem('user', JSON.stringify(this.user));
  }
  

  getUser(): any {
    if (!this.user) {
      const userData = localStorage.getItem('user');
      if (userData) {
        this.user = JSON.parse(userData);
      }
    }
    return this.user;
  }

  clearUser(): void {
    this.user = null;
    localStorage.removeItem('user');
  }
}

