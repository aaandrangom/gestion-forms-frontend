import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl =
    'https://gestion-de-formularios-mcevallos.onrender.com/api/usuario';

  constructor(private http: HttpClient) {}

  registerUser(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/`, userData);
  }

  verifyUser(userVerificationData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/verificar`, userVerificationData);
  }

  loginUser(authData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/autenticacion`, authData);
  }
}
