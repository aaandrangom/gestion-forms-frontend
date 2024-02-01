import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api/api.service';
import { ModalVerificarComponent } from '../modal-verificar/modal-verificar.component';
import { EmailService } from '../../services/email/email.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-verificar',
  templateUrl: './verificar.component.html',
  styleUrl: './verificar.component.css',
})
export class VerificarComponent implements OnInit {
  verificationForm: FormGroup;
  userEmail: string | null;

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private modalService: NgbModal,
    private emailService: EmailService,
    private router: Router //
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

    const userData = {
      email: this.userEmail,
      verificationcode: this.verificationForm.value.verificationcode,
    };

    this.apiService.verifyUser(userData).subscribe(
      (response) => {
        const mensajeVerificar = response.message;

        const modalRef = this.modalService.open(ModalVerificarComponent, {
          centered: true,
        });
        modalRef.componentInstance.message = mensajeVerificar;

        this.router.navigate(['/login']);
      },
      (error) => {
        const errorMessage = error.error.message;
        const modalRef = this.modalService.open(ModalVerificarComponent, {
          centered: true,
        });
        modalRef.componentInstance.message = errorMessage;
      }
    );
  }
}
