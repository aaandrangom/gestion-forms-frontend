import { Component, OnInit } from '@angular/core';
import { FormulariosService } from '../../../services/api/formularios/formularios.service';

@Component({
  selector: 'app-deshabilitados',
  templateUrl: './deshabilitados.component.html',
  styleUrl: './deshabilitados.component.css',
})
export class DeshabilitadosComponent implements OnInit {
  formularios: any[] = [];

  constructor(private formulariosService: FormulariosService) {}

  ngOnInit(): void {
    this.getFormsDisabled();
  }

  getFormsDisabled() {
    this.formulariosService.getFormsDisabled().subscribe(
      (data) => {
        this.formularios = data;
      },
      (error) => {
        console.error('Error al obtener los formularios habilitados:', error);
      }
    );
  }

  editarFormulario(formulario: any) {
    // Lógica para editar el formulario
    console.log('Editar formulario:', formulario);
  }

  habilitarFormulario(formulario: any) {
    this.formulariosService.updateStatusToTrue(formulario.formid).subscribe(
      (response) => {
        console.log('Formulario habilitado:', response);
        this.getFormsDisabled();
      },
      (error) => {
        console.error('Error al habilitar el formulario:', error);
      }
    );
  }
}
