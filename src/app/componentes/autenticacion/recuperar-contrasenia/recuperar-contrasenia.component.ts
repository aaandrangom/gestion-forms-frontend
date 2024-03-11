import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { ApiService } from '../../../services/api/usuario/usuario.service';

@Component({
  selector: 'app-recuperar-contrasenia',
  templateUrl: './recuperar-contrasenia.component.html',
  styleUrls: ['./recuperar-contrasenia.component.css'],
})
export class RecuperarContraseniaComponent implements OnInit {
  resetForm!: FormGroup;
  token: string = '';
  loading = false;
  submitted = false;
  error = '';
  recuperarContraseniaMessage: { text: string; type: string } | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.token = this.route.snapshot.queryParams['token'];
    this.resetForm = this.formBuilder.group(
      {
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    const newPassword = control.get('newPassword');
    const confirmPassword = control.get('confirmPassword');

    return newPassword &&
      confirmPassword &&
      newPassword.value !== confirmPassword.value
      ? { passwordMismatch: true }
      : null;
  };

  get f() {
    return this.resetForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    if (this.resetForm.invalid) {
      return;
    }

    this.loading = true;

    const passwordData = {
      token: this.token,
      newPassword: this.resetForm.value.newPassword,
    };

    this.apiService.resetPassword(passwordData).subscribe(
      (data) => {
        this.resetForm.reset();
        alert(
          'Contraseña restablecida exitosamente. Por favor, inicie sesión con su nueva contraseña.'
        );
        this.router.navigate(['/login']);
      },
      (error) => {
        this.error = error;
        this.loading = false;
      }
    );
  }

  cerrarMensaje() {
    this.recuperarContraseniaMessage = null;
  }
}
