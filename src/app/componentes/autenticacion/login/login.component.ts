import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/autenticacion/auth.service'; // Importa AuthService
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loginMessage: { text: string; type: string } | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    const authData = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
    };

    this.authService.login(authData).subscribe(
      (response) => {
        if (response && response.token) {
          this.loginMessage = {
            text: 'Inicio de sesión exitoso.',
            type: 'success',
          };

          localStorage.setItem('cedula', response.user.cedula);

          if (response.user.roleid === 1) {
            this.router.navigate(['/administrador']);
          } else {
            this.router.navigate(['/principal']);
          }
        }
      },
      (error) => {
        this.loginMessage = { text: error.error.message, type: 'danger' };
      }
    );
  }
}
