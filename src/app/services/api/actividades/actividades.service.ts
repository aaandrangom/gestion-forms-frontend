import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ActividadesService {
  private apiUrl =
    'https://gestion-de-formularios-mcevallos.onrender.com/api/actividades';

  constructor(private http: HttpClient) {}

  getAllActivities(): Observable<any[]> {
    const url = `${this.apiUrl}/administrador/listar`;
    return this.http.get<any[]>(url);
  }
}
