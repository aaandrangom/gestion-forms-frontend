import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api/api.service';
import { ModalLoginComponent } from '../modal-login/modal-login.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private modalService: NgbModal
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

    this.apiService.loginUser(authData).subscribe(
      (response) => {
        const mensajeRegistro = response.message;
        const modalRef = this.modalService.open(ModalLoginComponent, {
          centered: true,
        });
        modalRef.componentInstance.message = mensajeRegistro;
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
