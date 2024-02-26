import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CamposService {
  private apiUrl =
    'https://gestion-de-formularios-mcevallos.onrender.com/api/campos';
  constructor(private http: HttpClient) {}

  getAllFields(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/`);
  }

  addNewFormulario(nuevoFormulario: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/`, nuevoFormulario);
  }

  deleteCampo(nombreCampo: string): Observable<any> {
    const url = `${this.apiUrl}/${nombreCampo}`;
    return this.http.delete<any>(url);
  }
}
