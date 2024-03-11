import { Component, OnInit } from '@angular/core';
import { FormulariosService } from '../../../services/api/formularios/formularios.service';
import { Router } from '@angular/router';
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
  constructor(
    private formulariosService: FormulariosService,
    private router: Router
  ) {}

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
    if (this.dataTable) {
      this.dataTable.destroy();
    }
    this.formulariosService.getFormsDisabled().subscribe(
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
        '/administrador/formulariosdeshabilitados/formulario',
        formulario.formid,
      ]);
    } else {
      console.error('ID de formulario no definido');
    }
  }

  habilitarFormulario(formulario: any) {
    if (this.cedula !== null) {
      this.formulariosService
        .updateStatusToTrue(formulario.formid, this.cedula)
        .subscribe(
          (response) => {
            this.getFormsDisabled();
          },
          (error) => {
            console.error('Error al habilitar el formulario:', error);
          }
        );
    }
  }

  eliminarFormulario(formulario: any) {
    if (this.cedula !== null) {
      this.formulariosService
        .deleteForm(formulario.formid, this.cedula)
        .subscribe(
          (response) => {
            this.getFormsDisabled();
          },
          (error) => {
            console.error('Error al habilitar el formulario:', error);
          }
        );
    }
  }
}
