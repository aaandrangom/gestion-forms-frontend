import { Component, OnInit, OnDestroy } from '@angular/core';
import { PlantillasService } from '../../../services/api/plantillas/plantillas.service';
import { Router } from '@angular/router';

declare var $: any;
import 'datatables.net';

@Component({
  selector: 'app-plantillas',
  templateUrl: './plantillas.component.html',
  styleUrl: './plantillas.component.css',
})
export class PlantillasComponent implements OnInit, OnDestroy {
  plantillas: any[] = [];
  cedula: string | null = null;
  dataTable: any;
  plantillasMessage: { text: string; type: string } | null = null;

  constructor(
    private plantillasService: PlantillasService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getAllTemplates();
    this.cedula = localStorage.getItem('cedula');
  }

  ngOnDestroy(): void {
    if (this.dataTable) {
      this.dataTable.destroy();
    }
  }

  getAllTemplates() {
    this.plantillasService.getAllPlantillas().subscribe(
      (data) => {
        this.plantillas = data.plantillas;
        setTimeout(() => {
          this.initDataTable();
        }, 100);
      },
      (error) => {}
    );
  }

  initDataTable() {
    this.dataTable = $('#plantillasTable').DataTable({
      language: {
        url: '//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json',
      },
    });
  }

  onFileSelected(event: any, nombreArchivoActual: string) {
    const file = event.target.files[0];
    if (!file) {
      return;
    }

    this.plantillasService.updateFile(file, nombreArchivoActual).subscribe(
      (data) => {
        this.plantillasMessage = {
          text: data.message,
          type: 'success',
        };
        this.getAllTemplates();
      },
      (error) => {}
    );
  }

  eliminarPlantilla(plantilla: any) {
    this.plantillasService.deleteFile(plantilla).subscribe(
      (data) => {
        this.plantillasMessage = {
          text: data.message,
          type: 'success',
        };
        this.getAllTemplates();
      },
      (error) => {
        this.plantillasMessage = {
          text: error.error.error,
          type: 'danger',
        };
      }
    );
  }

  cerrarMensaje() {
    this.plantillasMessage = null;
  }
}
