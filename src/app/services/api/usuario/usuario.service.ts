import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../../../config/api.config';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl: string = `${API_CONFIG.production}/usuario`;

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

  forgotPassword(emailData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, emailData);
  }

  resetPassword(passwordData: any): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/reset-password?token=${passwordData.token}`,
      passwordData
    );
  }
}
