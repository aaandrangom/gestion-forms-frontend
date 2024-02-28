import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../services/api/usuario/usuario.service';
import { EmailService } from '../../../services/email/email.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-verificar',
  templateUrl: './verificar.component.html',
  styleUrls: ['./verificar.component.css'],
})
export class VerificarComponent implements OnInit {
  verificationForm: FormGroup;
  userEmail: string | null;
  verificarMensaje: { text: string; type: string } | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private emailService: EmailService,
    private router: Router
  ) {
    this.verificationForm = this.formBuilder.group({
      verificationcode: ['', [Validators.required]],
    });

    this.userEmail = this.emailService.getEmail();
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.verificationForm.invalid) {
      return;
    }

    const email = localStorage.getItem('email');

    const userData = {
      email: email,
      verificationcode: this.verificationForm.value.verificationcode,
    };

    this.apiService.verifyUser(userData).subscribe(
      (response) => {
        console.log(userData);
        this.verificarMensaje = {
          text: response.message,
          type: 'success',
        };
        console.log('ERROR', response);
        this.router.navigate(['/login']);
      },
      (error) => {
        this.verificarMensaje = {
          text: error.error.message,
          type: 'danger',
        };
        console.log(userData);
        console.log('ERROR', error);
      }
    );
  }
}
