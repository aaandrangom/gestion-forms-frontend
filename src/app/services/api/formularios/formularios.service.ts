import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FormulariosService {
  private apiUrl =
    'https://gestion-de-formularios-mcevallos.onrender.com/api/formulario';
  constructor(private http: HttpClient) {}

  getForm(formDate: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/template`, formDate);
  }

  getAllForm(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  getFormsEnabled(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/administrador/habilitados`);
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
}
