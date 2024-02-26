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

  getFormsEnabled(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/administrador/habilitados`);
  }

  getFormsDisabled(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/administrador/deshabilitados`);
  }

  updateStatusToFalse(formId: number): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/administrador/deshabilitar/${formId}`,
      null
    );
  }

  updateStatusToTrue(formId: number): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/administrador/habilitar/${formId}`,
      null
    );
  }

  getFormById(formId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${formId}`);
  }

  updateFormFields(
    formId: number,
    formname: any,
    description: any,
    fields: any
  ): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/administrador/editar/campos/${formId}`,
      {
        formname,
        description,
        fields,
      }
    );
  }

  createForm(
    formname: string,
    description: string,
    status: boolean
  ): Observable<any> {
    return this.http.post(`${this.apiUrl}/administrador/crear`, {
      formname,
      description,
      status,
    });
  }
}
