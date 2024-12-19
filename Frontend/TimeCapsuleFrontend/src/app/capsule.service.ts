import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';

export interface Capsule {
  capsuleID: number;
  title: string;
  message: string;
  lockDate: string;
  status: string;
  senderID: number;
  recipientID: number | null;
  senderUsername?: string;
  recipientUsername?: string;
  tags?: Tag[];
}

export interface Tag {
  tagID: number;
  tagName: string;
}

@Injectable({
  providedIn: 'root',
})
export class CapsuleService {
  private capsuleBaseUrl = 'http://localhost:5062/api/capsules';
  private tagsBaseUrl = 'http://localhost:5062/api/tags';
  private capsuleTagsBaseUrl = 'http://localhost:5062/api/capsuletags';

  constructor(private http: HttpClient) {}

  // **Capsule Management**

  getCapsules(): Observable<Capsule[]> {
    return this.http.get<Capsule[]>(this.capsuleBaseUrl);
  }

  getCapsuleById(capsuleID: number): Observable<Capsule> {
    return this.http.get<Capsule>(`${this.capsuleBaseUrl}/${capsuleID}`);
  }

  createCapsule(capsule: any): Observable<Capsule> {
    return this.http.post<Capsule>(this.capsuleBaseUrl, capsule);
  }

  deleteCapsule(capsuleID: number): Observable<void> {
    return this.http.delete<void>(`${this.capsuleBaseUrl}/${capsuleID}`);
  }

  // **Tag Management**

  getTags(): Observable<Tag[]> {
    return this.http.get<Tag[]>(this.tagsBaseUrl);
  }

  getTagsForCapsule(capsuleID: number): Observable<Tag[]> {
    return this.http.get<Tag[]>(`${this.capsuleTagsBaseUrl}/${capsuleID}`);
  }

  addTagsToCapsule(capsuleID: number, tagIDs: number[]): void {
    if (tagIDs.length === 0) {
      console.warn('No tags to add.');
      return;
    }
  
    tagIDs.forEach((tagID) => {
      this.http.post(`${this.capsuleTagsBaseUrl}/${capsuleID}/${tagID}`, {}).subscribe({
        next: () => {
          console.log(`Tag with ID ${tagID} added to Capsule with ID ${capsuleID}`);
        },
        error: (err) => {
          console.error(`Error adding tag with ID ${tagID} to Capsule with ID ${capsuleID}:`, err);
        },
      });
    });
  }
  
}
  
  
  
  

