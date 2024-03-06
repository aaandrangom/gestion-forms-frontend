import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../../../config/api.config';

@Injectable({
  providedIn: 'root',
})
export class ActividadesService {
  private apiUrl: string = `${API_CONFIG.production}/actividades`;

  constructor(private http: HttpClient) {}

  getAllActivities(): Observable<any[]> {
    const url = `${this.apiUrl}/administrador/listar`;
    return this.http.get<any[]>(url);
  }
}
