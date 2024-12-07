import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Capsule {
  capsuleID: number;
  title: string;
  message: string;
  lockDate: string; // ISO date format
  status: string;
  senderID: number;
  recipientID?: number; // Optional, can be null
  sender?: any; // Can be null
  recipient?: any; // Can be null
}



@Injectable({
  providedIn: 'root',
})
export class CapsuleService {
  private apiUrl = 'http://localhost:5062/api/Capsules'; // Replace with your backend URL

  constructor(private http: HttpClient) {}

  // Fetch all capsules
  getAllCapsules(): Observable<Capsule[]> {
    return this.http.get<Capsule[]>(`${this.apiUrl}`);
  }

  // Fetch capsule by ID
  getCapsuleById(id: number): Observable<Capsule> {
    return this.http.get<Capsule>(`${this.apiUrl}/${id}`);
  }

  // Create a new capsule
  createCapsule(capsule: Capsule): Observable<Capsule> {
    return this.http.post<Capsule>(`${this.apiUrl}`, capsule);
  }

  // Update an existing capsule
  updateCapsule(id: number, capsule: Capsule): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, capsule);
  }

  // Delete a capsule
  deleteCapsule(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
