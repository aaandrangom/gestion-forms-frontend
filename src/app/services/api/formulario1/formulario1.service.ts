import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, retry } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Formulario1Service {
  private apiUrl = 'http://localhost:3000/api/documento';
  constructor(private http: HttpClient) {}

  createDocument(documentData: any): Observable<any> {
    return this.http.post(this.apiUrl, documentData, {
      responseType: 'blob',
      headers: new HttpHeaders({
        Accept:
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      }),
    });
  }

  uploadImage(imageData: File): Observable<any> {
    const formData = new FormData();
    formData.append('image', imageData);
    return this.http.post(`${this.apiUrl}/imagen`, formData);
  }
}
