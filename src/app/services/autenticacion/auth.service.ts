import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { ApiService } from '../api/usuario/usuario.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<any>;

  constructor(private apiService: ApiService) {
    // Inicializa currentUserSubject con el valor almacenado o null si no hay nada almacenado
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<any>(
      storedUser ? JSON.parse(storedUser) : null
    );
  }

  public get currentUserValue() {
    return this.currentUserSubject.value;
  }

  login(authData: any) {
    return this.apiService.loginUser(authData).pipe(
      map((response) => {
        if (response && response.token) {
          localStorage.setItem('currentUser', JSON.stringify(response));
          this.currentUserSubject.next(response);
        }
        return response;
      })
    );
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }
}
