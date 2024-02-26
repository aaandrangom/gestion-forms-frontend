import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../services/api/usuario/usuario.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalContentComponent } from '../../diseño/modal-content/modal-content.component';
import { EmailService } from '../../../services/email/email.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css'],
})
export class RegistroComponent {
  registroForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private modalService: NgbModal,
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
        console.log('Usuario registrado exitosamente', response);
        const mensajeRegistro = response.message;
        this.emailService.setEmail(userData.email);
        const modalRef = this.modalService.open(ModalContentComponent, {
          centered: true,
        });
        modalRef.componentInstance.message = mensajeRegistro;

        this.router.navigate(['/verificar']);
      },
      (error) => {
        console.error('Error al registrar usuario', error);
      }
    );
  }
}
