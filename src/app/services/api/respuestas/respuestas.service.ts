import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RespuestasService {
  private apiUrl =
    'https://gestion-de-formularios-mcevallos.onrender.com/api/respuesta';
  constructor(private http: HttpClient) {}

  insertResponses(responseData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/`, responseData);
  }

  getResponsesByCedulaAndFormId(
    cedula: string,
    formid: number
  ): Observable<any> {
    return this.http.post(`${this.apiUrl}/formulario`, {
      cedula,
      formid,
    });
  }
}
