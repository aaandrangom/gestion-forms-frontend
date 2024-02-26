import { Component, OnInit } from '@angular/core';
import { FormulariosService } from '../../../services/api/formularios/formularios.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-habilitados',
  templateUrl: './habilitados.component.html',
  styleUrl: './habilitados.component.css',
})
export class FormulariosHabilitadosComponent implements OnInit {
  formularios: any[] = [];

  constructor(
    private formulariosService: FormulariosService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getFormsEnabled();
  }

  getFormsEnabled() {
    this.formulariosService.getFormsEnabled().subscribe(
      (data) => {
        this.formularios = data;
      },
      (error) => {
        console.error('Error al obtener los formularios habilitados:', error);
      }
    );
  }

  editarFormulario(formulario: any) {
    if (formulario.formid !== undefined) {
      this.router.navigate([
        '/administrador/formularioshabilitados/formulario',
        formulario.formid,
      ]);
    } else {
      console.error('ID de formulario no definido');
    }
  }

  deshabilitarFormulario(formulario: any) {
    this.formulariosService.updateStatusToFalse(formulario.formid).subscribe(
      (response) => {
        console.log('Formulario deshabilitado:', response);
        this.getFormsEnabled();
      },
      (error) => {
        console.error('Error al deshabilitar el formulario:', error);
      }
    );
  }
}
