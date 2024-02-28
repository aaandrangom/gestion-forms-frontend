import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlantillasService {
  private apiUrl =
    'https://gestion-de-formularios-mcevallos.onrender.com/api/plantillas';

  constructor(private http: HttpClient) {}

  uploadFile(file: File, cedula: string): Observable<any> {
    const url = `${this.apiUrl}/administrador/subir`;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('cedula', cedula);

    return this.http.post<any>(url, formData);
  }
}
