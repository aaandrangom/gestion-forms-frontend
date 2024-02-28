import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormulariosService } from '../../../services/api/formularios/formularios.service';
import { Router } from '@angular/router';

declare var $: any;
import 'datatables.net';

@Component({
  selector: 'app-habilitados',
  templateUrl: './habilitados.component.html',
  styleUrls: ['./habilitados.component.css'],
})
export class FormulariosHabilitadosComponent implements OnInit, OnDestroy {
  formularios: any[] = [];
  cedula: string | null = null;
  dataTable: any; // Declaración de la propiedad dataTable

  constructor(
    private formulariosService: FormulariosService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getFormsEnabled();
    this.cedula = localStorage.getItem('cedula');
  }

  ngOnDestroy(): void {
    if (this.dataTable) {
      this.dataTable.destroy();
    }
  }

  getFormsEnabled() {
    this.formulariosService.getFormsEnabled().subscribe(
      (data) => {
        this.formularios = data;
        setTimeout(() => {
          this.initDataTable();
        }, 100);
      },
      (error) => {
        console.error('Error al obtener los formularios habilitados:', error);
      }
    );
  }

  initDataTable() {
    this.dataTable = $('#formulariosTable').DataTable({
      language: {
        url: '//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json',
      },
    });
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
    if (this.cedula !== null) {
      this.formulariosService
        .updateStatusToFalse(formulario.formid, this.cedula)
        .subscribe(
          (response) => {
            console.log('Formulario deshabilitado:', response);
            this.getFormsEnabled();
          },
          (error) => {
            console.error('Error al deshabilitar el formulario:', error);
          }
        );
    } else {
      console.error('El valor de cedula es nulo');
    }
  }
}
