import { Component, OnInit } from '@angular/core';
import { FormulariosService } from '../../../services/api/formularios/formularios.service';
declare var $: any;
import 'datatables.net';

@Component({
  selector: 'app-deshabilitados',
  templateUrl: './deshabilitados.component.html',
  styleUrl: './deshabilitados.component.css',
})
export class DeshabilitadosComponent implements OnInit {
  formularios: any[] = [];
  cedula: string | null = null;
  dataTable: any;
  constructor(private formulariosService: FormulariosService) {}

  ngOnInit(): void {
    this.getFormsDisabled();
    this.cedula = localStorage.getItem('cedula');
  }

  ngOnDestroy(): void {
    if (this.dataTable) {
      this.dataTable.destroy();
    }
  }

  getFormsDisabled() {
    this.formulariosService.getFormsDisabled().subscribe(
      (data) => {
        this.formularios = data;
        // Esperar un breve período antes de inicializar DataTables
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
    console.log('Editar formulario:', formulario);
  }

  habilitarFormulario(formulario: any) {
    if (this.cedula !== null) {
      this.formulariosService
        .updateStatusToTrue(formulario.formid, this.cedula)
        .subscribe(
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
}
