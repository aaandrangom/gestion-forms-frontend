import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../../../config/api.config';

@Injectable({
  providedIn: 'root',
})
export class PlantillasService {
  private apiUrl: string = `${API_CONFIG.production}/plantillas`;
  constructor(private http: HttpClient) {}

  getAllPlantillas(): Observable<any> {
    const url = `${this.apiUrl}/administrador/listar`;

    return this.http.get<any>(url);
  }

  uploadFile(file: File, cedula: string): Observable<any> {
    const url = `${this.apiUrl}/administrador/subir`;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('cedula', cedula);

    return this.http.post<any>(url, formData);
  }

  updateFile(file: File, nombreArchivoActual: string): Observable<any> {
    const url = `${this.apiUrl}/administrador/actualizar/${nombreArchivoActual}`;
    const formData = new FormData();
    formData.append('file', file);

    return this.http.put<any>(url, formData);
  }

  deleteFile(fileName: string): Observable<any> {
    const url = `${this.apiUrl}/administrador/eliminar/${fileName}`;

    return this.http.delete<any>(url);
  }
}
