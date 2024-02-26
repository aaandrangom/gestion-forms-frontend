import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../../services/autenticacion/auth.service'; // Importa AuthService
import { ModalLoginComponent } from '../../diseño/modal-login/modal-login.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService, // Usa AuthService
    private modalService: NgbModal,
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
          const mensajeRegistro = 'Inicio de sesión exitoso.';
          const modalRef = this.modalService.open(ModalLoginComponent, {
            centered: true,
          });
          modalRef.componentInstance.message = mensajeRegistro;

          // Guarda la cédula si es necesario o cualquier otra información relevante
          localStorage.setItem('cedula', response.user.cedula);

          // Aquí decides a dónde redirigir basado en el roleid del usuario
          // Asegúrate de que la propiedad que contenga el roleid se llame exactamente así en la respuesta
          if (response.user.roleid === 1) {
            // Si el usuario es administrador (roleid === 1), redirige a /administrador
            this.router.navigate(['/administrador']);
          } else {
            // Para cualquier otro rol, redirige a /principal
            this.router.navigate(['/principal']);
          }
        }
      },
      (error) => {
        const errorMessage = error.error.message;
        const modalRef = this.modalService.open(ModalLoginComponent, {
          centered: true,
        });
        modalRef.componentInstance.message = errorMessage;
      }
    );
  }
}
