import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class Formulario1Service {
  private apiUrl =
    'https://gestion-de-formularios-mcevallos.onrender.com/api/documento';

  constructor(private http: HttpClient) {}

  createDocument(documentData: any): Observable<any> {
    return this.http
      .post(this.apiUrl, documentData, {
        responseType: 'blob',
        headers: new HttpHeaders({
          Accept:
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        }),
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (
            error.error instanceof Blob &&
            error.error.type === 'application/json'
          ) {
            const reader = new FileReader();
            return new Observable<any>((observer) => {
              reader.onload = () => {
                const errorJson = JSON.parse(reader.result as string);
                observer.error(errorJson);
              };
              reader.readAsText(error.error);
            });
          } else {
            return throwError(error);
          }
        })
      );
  }

  uploadImage(imageData: File): Observable<any> {
    const formData = new FormData();
    formData.append('image', imageData);
    return this.http.post(`${this.apiUrl}/imagen`, formData);
  }
}
