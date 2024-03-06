import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../services/api/usuario/usuario.service';

@Component({
  selector: 'app-olvidar-contrasenia',
  templateUrl: './olvidar-contrasenia.component.html',
  styleUrl: './olvidar-contrasenia.component.css',
})
export class OlvidarContraseniaComponent implements OnInit {
  forgotPasswordForm: FormGroup;
  resetPasswordMessage: string = '';
  resetPasswordError: string = '';
  olvidarContraseniaMessage: { text: string; type: string } | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService
  ) {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit(): void {
    if (this.forgotPasswordForm.invalid) {
      return;
    }

    const email = this.forgotPasswordForm.value.email;

    this.apiService.forgotPassword({ email }).subscribe(
      (response) => {
        this.olvidarContraseniaMessage = {
          text: response.message,
          type: 'success',
        };
        this.resetPasswordMessage = response.message;
        this.forgotPasswordForm.reset();
      },
      (error) => {
        this.olvidarContraseniaMessage = {
          text: error.error.message,
          type: 'danger',
        };
        this.resetPasswordError = error.message;
      }
    );
  }

  cerrarMensaje() {
    this.olvidarContraseniaMessage = null;
  }
}
