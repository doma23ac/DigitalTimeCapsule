import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = 'http://localhost:5062/api'; // Backend API base URL
  private credentials: string | null = null; // Base64-encoded credentials
  private user: any = null; // User object

  constructor(private http: HttpClient) {}

  // **1. Set Credentials After Login**
  setCredentials(username: string, password: string): void {
    this.credentials = btoa(`${username}:${password}`); // Encode credentials
    localStorage.setItem('auth_credentials', this.credentials);
  }

  // **2. Generate Basic Auth Headers**
  private getAuthHeaders(): HttpHeaders {
    if (!this.credentials) {
      this.credentials = localStorage.getItem('auth_credentials');
    }
    if (this.credentials) {
      return new HttpHeaders({
        Authorization: `Basic ${this.credentials}`,
        'Content-Type': 'application/json',
      });
    }
    throw new Error('No credentials set. User is not authenticated.');
  }

  // **3. Store User Data Locally**
  setUser(user: any): void {
    this.user = {
      userId: user.userId,
      username: user.username,
      email: user.email,
    };
    localStorage.setItem('user', JSON.stringify(this.user));
  }

  // **4. Retrieve User Data**
  getUser(): any {
    if (!this.user) {
      const userData = localStorage.getItem('user');
      if (userData) {
        this.user = JSON.parse(userData);
      }
    }
    return this.user;
  }

  // **5. Check Authentication Status**
  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_credentials');
  }

  // **6. Clear Credentials and User Data (Logout)**
  clearUser(): void {
    this.credentials = null;
    this.user = null;
    localStorage.removeItem('auth_credentials');
    localStorage.removeItem('user');
  }

  // **7. Backend API Calls**

  // Retrieve user by username
  getUserByUsername(username: string): Observable<any> {
    const url = `${this.baseUrl}/users/by-username/${username}`;
    return this.http.get(url, { headers: this.getAuthHeaders() });
  }

  // Create a new capsule
  createCapsule(capsule: any): Observable<any> {
    const url = `${this.baseUrl}/capsules`;
    return this.http.post(url, capsule, { headers: this.getAuthHeaders() });
  }

  // Fetch all available tags
  getTags(): Observable<any> {
    const url = `${this.baseUrl}/tags`;
    return this.http.get(url, { headers: this.getAuthHeaders() });
  }

  // Add a tag to a capsule
  addTagToCapsule(capsuleID: number, tagID: number): Observable<any> {
    const url = `${this.baseUrl}/capsuletags/${capsuleID}/${tagID}`;
    return this.http.post(url, {}, { headers: this.getAuthHeaders() });
  }

  // Example: Validate User Login (Check credentials on the backend)
  validateUser(username: string, password: string): Observable<any> {
    const url = `${this.baseUrl}/login`;
    const headers = new HttpHeaders({
      Authorization: `Basic ${btoa(`${username}:${password}`)}`,
    });
    return this.http.post(url, null, { headers });
  }
}
