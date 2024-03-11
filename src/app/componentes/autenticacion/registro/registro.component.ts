import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../services/api/usuario/usuario.service';
import { EmailService } from '../../../services/email/email.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css'],
})
export class RegistroComponent {
  registroForm: FormGroup;
  mensaje: { text: string; type: string } | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private emailService: EmailService,
    private router: Router
  ) {
    this.registroForm = this.formBuilder.group({
      cedula: ['', Validators.required],
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit(): void {
    const userData = this.registroForm.value;

    this.apiService.registerUser(userData).subscribe(
      (response) => {
        this.mensaje = {
          text: response.message,
          type: 'success',
        };
        localStorage.setItem('email', userData.email);
        this.router.navigate(['/verificar']);
      },
      (error) => {
        this.mensaje = {
          text: error.error.message,
          type: 'danger',
        };
      }
    );
  }

  cerrarMensaje() {
    this.mensaje = null;
  }
}
