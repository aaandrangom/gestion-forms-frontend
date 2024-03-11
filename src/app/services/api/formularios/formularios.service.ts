import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../../../config/api.config';

@Injectable({
  providedIn: 'root',
})
export class FormulariosService {
  private apiUrl: string = `${API_CONFIG.production}/formulario`;
  private currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  constructor(private http: HttpClient) {}

  getForm(formDate: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/template`, formDate);
  }

  getAllForm(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  getFormsEnabled(): Observable<any[]> {
    const token = this.currentUser.token || '';

    const headers = new HttpHeaders({
      Authorization: token,
    });

    return this.http.get<any[]>(`${this.apiUrl}/administrador/habilitados`, {
      headers,
    });
  }

  getFormsDisabled(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/administrador/deshabilitados`);
  }

  updateStatusToFalse(formId: number, cedula: string): Observable<any> {
    const url = `${this.apiUrl}/administrador/deshabilitar/${formId}`;
    return this.http.put(url, { cedula });
  }

  updateStatusToTrue(formId: number, cedula: string): Observable<any> {
    const url = `${this.apiUrl}/administrador/habilitar/${formId}`;
    return this.http.put(url, { cedula });
  }

  getFormById(formId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${formId}`);
  }

  updateFormFields(
    formId: number,
    formname: any,
    description: any,
    fields: any,
    cedula: string
  ): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/administrador/editar/campos/${formId}`,
      {
        formname,
        description,
        fields,
        cedula,
      }
    );
  }

  createForm(
    formname: string,
    description: string,
    status: boolean,
    cedula: string
  ): Observable<any> {
    return this.http.post(`${this.apiUrl}/administrador/crear`, {
      formname,
      description,
      status,
      cedula,
    });
  }

  deleteForm(id: number, cedula: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/administrador/eliminar/${id}`, {
      body: { cedula },
    });
  }
}
