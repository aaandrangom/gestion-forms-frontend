import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormulariosService } from '../../../services/api/formularios/formularios.service';
import { PlantillasService } from '../../../services/api/plantillas/plantillas.service';

@Component({
  selector: 'app-crear-formulario',
  templateUrl: './crear-formulario.component.html',
  styleUrl: './crear-formulario.component.css',
})
export class CrearFormularioComponent implements OnInit {
  formGroup!: FormGroup;
  cedula: string | null = null;
  mensaje: { text: string; type: string } | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private formulariosService: FormulariosService,
    private plantillasService: PlantillasService
  ) {}

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      formname: ['', Validators.required],
      description: ['', Validators.required],
      status: [true, Validators.required],
    });
    this.cedula = localStorage.getItem('cedula');
  }

  onSubmit() {
    if (this.formGroup.valid) {
      const formname = this.formGroup.value.formname;
      const description = this.formGroup.value.description;
      const status = this.formGroup.value.status;

      if (this.cedula !== null) {
        this.formulariosService
          .createForm(formname, description, status, this.cedula)
          .subscribe(
            (response) => {
              this.mensaje = {
                text: 'Formulario creado con éxito',
                type: 'success',
              };
              this.formGroup.reset();
            },
            (error) => {
              this.mensaje = {
                text: 'Error en la creación del formulario',
                type: 'danger',
              };
            }
          );
      }
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];

      if (this.cedula != null) {
        this.plantillasService.uploadFile(file, this.cedula).subscribe({
          next: (response) => {},
          error: (error) => {},
        });
      }
    }
  }

  cerrarMensaje() {
    this.mensaje = null;
  }
}
