import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../../../config/api.config';

@Injectable({
  providedIn: 'root',
})
export class RespuestasService {
  private apiUrl: string = `${API_CONFIG.production}/respuesta`;

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
