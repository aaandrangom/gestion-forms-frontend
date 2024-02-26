import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormulariosService } from '../../../services/api/formularios/formularios.service';

@Component({
  selector: 'app-crear-formulario',
  templateUrl: './crear-formulario.component.html',
  styleUrl: './crear-formulario.component.css',
})
export class CrearFormularioComponent implements OnInit {
  formGroup!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private formulariosService: FormulariosService
  ) {}

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      formname: ['', Validators.required],
      description: ['', Validators.required],
      status: [true, Validators.required],
    });
  }

  onSubmit() {
    if (this.formGroup.valid) {
      const formname = this.formGroup.value.formname;
      const description = this.formGroup.value.description;
      const status = this.formGroup.value.status;
      this.formulariosService
        .createForm(formname, description, status)
        .subscribe(
          (response) => {
            console.log('Formulario creado: ', response);
          },
          (error) => {
            console.log('Formulario no creado erro: ', error);
          }
        );
    }
  }
}
