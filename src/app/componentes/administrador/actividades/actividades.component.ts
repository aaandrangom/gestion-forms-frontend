import { Component, OnInit } from '@angular/core';
import { ActividadesService } from '../../../services/api/actividades/actividades.service';

declare var $: any;
import 'datatables.net';

interface Actividad {
  activityid: number;
  cedula: string;
  activitytype: string;
  description: string;
  timestamp: string;
  ipaddress: string;
}

@Component({
  selector: 'app-actividades',
  templateUrl: './actividades.component.html',
  styleUrls: ['./actividades.component.css'],
})
export class ActividadesComponent implements OnInit {
  actividades: Actividad[] = [];
  dataTable: any; // Variable para almacenar la instancia de DataTable

  constructor(private actividadesService: ActividadesService) {}

  ngOnInit(): void {
    this.obtenerActividades();
  }

  ngOnDestroy(): void {
    if (this.dataTable) {
      this.dataTable.destroy();
    }
  }

  obtenerActividades() {
    this.actividadesService.getAllActivities().subscribe(
      (data: Actividad[]) => {
        this.actividades = data;
        setTimeout(() => {
          this.initDataTable();
        }, 100);
      },
      (error) => {
        console.error('Error al obtener actividades:', error);
      }
    );
  }

  initDataTable() {
    this.dataTable = $('#tablaActividades').DataTable({
      language: {
        url: '//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json',
      },
    });
  }
}
