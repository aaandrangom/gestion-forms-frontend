import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FormulariosService {
  private apiUrl = 'http://localhost:3000/api/formulario';
  constructor(private http: HttpClient) {}

  getForm(formDate: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/template`, formDate);
  }

  getAllForm(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }
}
