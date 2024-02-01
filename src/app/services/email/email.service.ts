import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  private userEmail: string | null = null;

  setEmail(email: string): void {
    this.userEmail = email;
  }

  public getEmail(): string | null {
    return this.userEmail;
  }
}
