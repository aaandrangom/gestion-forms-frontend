import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormulariosService } from '../../../services/api/formularios/formularios.service';
import { CamposService } from '../../../services/api/campos/campos.service';
import { switchMap } from 'rxjs/operators';
declare var $: any;
import 'datatables.net';

interface Campo {
  nombreCampo: string;
  nombreLabel: string;
  tipo: string;
  validaciones?: any;
  valor: string; // Agregar la propiedad 'valor' al tipo Campo si es necesario
}

interface Formulario {
  formname: string;
  description: string;
  fields: { [key: string]: string };
}

@Component({
  selector: 'app-formulario-detalle',
  templateUrl: './formulario-detalle.component.html',
  styleUrls: ['./formulario-detalle.component.css'],
})
export class FormularioDetalleComponent implements OnInit, AfterViewInit {
  formulario: Formulario = {
    formname: '',
    description: '',
    fields: {},
  };
  campos: Campo[] = [];
  campoEditado: Campo | null = null;
  nuevoCampoModalVisible: boolean = false;
  paginacionActivada: boolean = true;
  longitudCheck: boolean = false;
  formatoCheck: boolean = false;
  longitudValue: string = '';
  formatoValue: string = '';
  esEnteroCheck: boolean = false;
  cedula: string | null = null;
  dataTable: any;
  mensaje: { text: string; type: string } | null = null;
  constructor(
    private route: ActivatedRoute,
    private formulariosService: FormulariosService,
    private camposService: CamposService
  ) {}

  ngAfterViewInit(): void {
    this.nuevoCampoModalVisible = true;
  }

  configurarValidaciones(campo: any) {
    this.longitudCheck =
      campo.validaciones && campo.validaciones.longitud != undefined;
    this.formatoCheck =
      campo.validaciones && campo.validaciones.formato != undefined;
    this.longitudValue = this.longitudCheck
      ? campo.validaciones.longitud.toString()
      : '';
    this.formatoValue = this.formatoCheck ? campo.validaciones.formato : '';
    this.esEnteroCheck =
      campo.validaciones && campo.validaciones.esEntero != undefined;

    console.log(campo);
  }

  ngOnInit(): void {
    this.nuevoCampoModalVisible = false;
    this.route.params
      .pipe(
        switchMap((params) => {
          const formId = params['id'];
          if (formId) {
            return this.formulariosService.getFormById(formId);
          } else {
            throw new Error('ID de formulario no definido');
          }
        })
      )
      .subscribe(
        (data: any) => {
          this.formulario = data;
          setTimeout(() => {
            this.initDataTable();
          }, 100);
          this.obtenerCamposPorFormulario();
        },
        (error) => {}
      );

    this.cedula = localStorage.getItem('cedula');
  }

  initDataTable() {
    this.dataTable = $('#tableDetalles').DataTable({
      language: {
        url: '//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json',
      },
    });
  }

  ngOnDestroy(): void {
    if (this.dataTable) {
      this.dataTable.destroy();
    }
  }

  obtenerCamposPorFormulario() {
    this.camposService.getAllFields().subscribe(
      (data: any) => {
        if (
          data &&
          data.formularios &&
          Array.isArray(data.formularios.campos)
        ) {
          const camposExtendidos = Object.keys(this.formulario.fields).map(
            (nombreCampo) => {
              const campoEncontrado = data.formularios.campos.find(
                (campo: Campo) => campo.nombreCampo === nombreCampo
              );

              return {
                nombreCampo: nombreCampo,
                valor: this.formulario.fields[nombreCampo],
                nombreLabel: campoEncontrado ? campoEncontrado.nombreLabel : '',
                tipo: campoEncontrado ? campoEncontrado.tipo : '',
                validaciones: campoEncontrado
                  ? this.obtenerValidaciones(campoEncontrado)
                  : '',
              };
            }
          );

          this.campos = camposExtendidos;
        }
      },
      (error) => {}
    );
  }

  obtenerValidaciones(campo: Campo): any {
    return campo.validaciones ? campo.validaciones : {};
  }

  editarCampo(campo: Campo) {
    this.campoEditado = campo;
    this.configurarValidaciones(campo);

    this.openModal();
  }

  eliminarCampo(campo: Campo) {
    console.log('Eliminando campo:', campo);
    const index = this.campos.indexOf(campo);

    if (index !== -1) {
      this.campos.splice(index, 1);
    }

    this.camposService.deleteCampo(campo.nombreCampo).subscribe(
      () => {
        const index = this.campos.indexOf(campo);
        if (index !== -1) {
          this.campos.splice(index, 1);
        }
      },
      (error) => {
        console.error('Error al eliminar campo del servidor:', error);
      }
    );
  }

  openModal() {
    $('#modal').modal('show');
  }

  closeModal() {
    $('#modal').modal('hide');
  }

  guardarCambiosFormulario() {
    const formularioConCambios = {
      formname: this.formulario.formname,
      description: this.formulario.description,
      fields: this.campos.reduce(
        (acc: { [key: string]: string }, campo: Campo) => {
          acc[campo.nombreCampo] = campo.valor;
          return acc;
        },
        {}
      ),
    };

    const formularioId = this.route.snapshot.params['id'];

    if (this.cedula !== null) {
      this.formulariosService
        .updateFormFields(
          formularioId,
          formularioConCambios.formname,
          formularioConCambios.description,
          formularioConCambios.fields,
          this.cedula
        )
        .subscribe(
          (response) => {
            this.mensaje = {
              text: 'Formulario actualizado correctamente',
              type: 'success',
            };
            this.formulario.description = formularioConCambios.description;
          },
          (error) => {
            console.error('Error al actualizar el formulario:', error);
            this.mensaje = {
              text: 'No se actualizó correctamente',
              type: 'danger',
            };
          }
        );
    }
  }

  guardarNuevoCampo() {
    const nuevoCampoNombre = (
      document.getElementById('nuevoCampoNombre') as HTMLInputElement
    ).value;
    const nuevoCampoValor = (
      document.getElementById('nuevoCampoValor') as HTMLInputElement
    ).value;
    const nuevoCampoTipo = (
      document.getElementById('nuevoCampoTipo') as HTMLSelectElement
    ).value;

    if (!nuevoCampoNombre.trim()) {
      alert('Por favor ingrese un nombre para el campo.');
      return;
    }

    const validaciones: any = {};

    if (this.longitudCheck) {
      validaciones.longitud = parseInt(this.longitudValue);
    }
    if (this.formatoCheck) {
      validaciones.formato = this.formatoValue;
    }
    if (this.esEnteroCheck) {
      validaciones.esEntero = true;
    }

    const nuevoCampo: Campo = {
      nombreCampo: nuevoCampoNombre,
      nombreLabel: nuevoCampoValor,
      tipo: nuevoCampoTipo,
      valor: nuevoCampoValor,
      validaciones: validaciones,
    };

    const nuevoCampoJSON = {
      nombreCampo: nuevoCampo.nombreCampo,
      nombreLabel: nuevoCampo.nombreLabel,
      tipo: nuevoCampo.tipo,
      validaciones: nuevoCampo.validaciones,
    };

    this.campos.push(nuevoCampo);

    this.closeModal();

    this.camposService.addNewFormulario(nuevoCampoJSON).subscribe(
      (response) => {
        console.log('Campo añadido correctamente:', response);

        this.closeModal();
      },
      (error) => {
        console.error('Error al añadir el campo:', error);
      }
    );
  }

  guardarCampoEditado() {
    if (!this.campoEditado) {
      console.error('No se ha seleccionado ningún campo para editar.');
      return;
    }

    // Obtener los elementos del DOM
    const nombreCampoElement = document.getElementById(
      'campoNombre'
    ) as HTMLInputElement | null;
    const nombreLabelElement = document.getElementById(
      'campoValor'
    ) as HTMLInputElement | null;
    const tipoElement = document.getElementById(
      'campoTipo'
    ) as HTMLSelectElement | null;

    // Verificar si los elementos existen
    if (!nombreCampoElement || !nombreLabelElement || !tipoElement) {
      console.error('Alguno de los elementos no se encontró en el DOM.');
      return;
    }

    // Obtener los valores de los elementos usando el operador de navegación segura
    const nombreCampo = nombreCampoElement.value;
    const nombreLabel = nombreLabelElement.value;
    const tipo = tipoElement.value;

    if (!nombreCampo.trim()) {
      alert('Por favor ingrese un nombre para el campo.');
      return;
    }

    this.campoEditado.nombreCampo = nombreCampo;
    this.campoEditado.nombreLabel = nombreLabel;
    this.campoEditado.tipo = tipo;

    nombreCampoElement.value = '';

    this.closeModal();
  }

  openModalAgregar() {
    this.nuevoCampoModalVisible = true;
    $('#nuevoCampoModal').modal('show');
  }

  closeModalAgregar() {
    $('#nuevoCampoModal').modal('hide');
  }

  cerrarMensaje() {
    this.mensaje = null;
  }
}
