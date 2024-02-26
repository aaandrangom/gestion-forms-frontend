import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormulariosService } from '../../../services/api/formularios/formularios.service';
import { CamposService } from '../../../services/api/campos/campos.service';
import { switchMap } from 'rxjs/operators';
import Sortable from 'sortablejs';

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
  paginaActual = 1;
  filasPorPagina = 5;
  totalPaginas = 1;
  campoEditado: Campo | null = null;
  nuevoCampoModalVisible: boolean = false;
  paginacionActivada: boolean = true;
  longitudCheck: boolean = false;
  formatoCheck: boolean = false;
  longitudValue: string = '';
  formatoValue: string = '';
  esEnteroCheck: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private formulariosService: FormulariosService,
    private camposService: CamposService
  ) {}

  ngAfterViewInit(): void {
    this.inicializarSortable();
  }

  inicializarSortable() {
    const el = document.querySelector('tbody');
    if (!el) return;

    new Sortable(el, {
      animation: 150, // Animación de arrastre
      onEnd: (/** Evento de tipo SortableEvent */) => {
        // Aquí puedes actualizar tu modelo de datos según el nuevo orden
        // Esto podría implicar reordenar el array 'campos' y luego actualizarlo en el servidor si es necesario
        this.actualizarOrdenCampos();
      },
    });
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

  actualizarOrdenCampos() {
    const tbody = document.querySelector('tbody');

    if (!tbody) {
      console.error('No se encontró el tbody');
      return;
    }

    const filas = Array.from(tbody.children);
    const camposReordenados: Campo[] = [];

    for (const fila of filas) {
      const nombreCampo = fila
        .querySelector('.nombreCampo')
        ?.textContent?.trim();
      if (nombreCampo) {
        const campoEncontrado = this.campos.find(
          (campo) => campo.nombreCampo === nombreCampo
        );
        if (campoEncontrado) {
          camposReordenados.push(campoEncontrado);
        }
      }
    }

    // Reordenar solo los campos dentro de la página actual
    const inicio = (this.paginaActual - 1) * this.filasPorPagina;
    const fin = inicio + this.filasPorPagina;
    const camposEnPaginaActual = camposReordenados.slice(inicio, fin);

    // Actualizar los campos solo en la página actual
    for (
      let i = inicio, j = 0;
      i < fin && j < camposEnPaginaActual.length;
      i++, j++
    ) {
      this.campos[i] = camposEnPaginaActual[j];
    }
  }

  ngOnInit(): void {
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
          console.log('Datos del formulario:', data);
          this.formulario = data;

          this.obtenerCamposPorFormulario();
        },
        (error) => {
          console.error('Error al obtener el formulario:', error);
        }
      );
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
              console.log('a', campoEncontrado);

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
          this.calcularTotalPaginas();
        } else {
          console.error(
            'La respuesta del servidor no tiene la estructura esperada.'
          );
        }
      },
      (error) => {
        console.error('Error al obtener los campos:', error);
      }
    );
  }

  calcularTotalPaginas() {
    if (this.paginacionActivada) {
      // Calcular el número total de páginas basado en la longitud del arreglo de campos
      this.totalPaginas = Math.ceil(this.campos.length / this.filasPorPagina);
    } else {
      // Si la paginación está desactivada, solo hay una página
      this.totalPaginas = 1;
    }

    // Asegurarse de que la página actual no exceda el número total de páginas
    if (this.paginaActual > this.totalPaginas) {
      this.paginaActual = this.totalPaginas;
    }
  }

  togglePaginacion() {
    this.paginacionActivada = !this.paginacionActivada;
    this.calcularTotalPaginas();
  }

  obtenerDatosPaginados(): Campo[] {
    if (this.paginacionActivada) {
      // Obtener el índice de inicio de los datos en la página actual
      const inicio = (this.paginaActual - 1) * this.filasPorPagina;

      // Obtener el índice de fin de los datos en la página actual
      const fin = inicio + this.filasPorPagina;

      // Obtener los datos visibles en la página actual
      return this.campos.slice(inicio, fin);
    } else {
      // Si la paginación está desactivada, retornar todos los datos
      return this.campos;
    }
  }

  siguientePagina() {
    if (this.paginaActual < this.totalPaginas) {
      this.paginaActual++;
    }
  }

  anteriorPagina() {
    if (this.paginaActual > 1) {
      this.paginaActual--;
    }
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
      // Eliminar el campo del arreglo
      this.campos.splice(index, 1);
    } else {
      console.error(
        'El campo a eliminar no se encontró en el arreglo de campos.'
      );
    }

    this.camposService.deleteCampo(campo.nombreCampo).subscribe(
      () => {
        console.log('Campo eliminado con éxito del servidor.');
        // Eliminar el campo del arreglo local solo si se eliminó correctamente del servidor
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
    const modal = document.getElementById('modal');
    if (modal) {
      modal.classList.remove('hidden');
    }
  }

  closeModal() {
    const modal = document.getElementById('modal');
    if (modal) {
      modal.classList.add('hidden');
    }
  }

  openModalAgregar() {
    this.nuevoCampoModalVisible = true;

    const modal = document.getElementById('nuevoCampoModal');
    if (modal) {
      modal.classList.remove('hidden');
    }
  }

  closeModalAgregar() {
    this.nuevoCampoModalVisible = false;

    const modal = document.getElementById('nuevoCampoModal');
    if (modal) {
      modal.classList.add('hidden');
    }
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

    console.log('Datos del formulario a enviar:', formularioConCambios);

    // Obtener el ID del formulario de la ruta actual
    const formularioId = this.route.snapshot.params['id'];

    // Llamar al servicio para actualizar los campos del formulario
    this.formulariosService
      .updateFormFields(
        formularioId,
        formularioConCambios.formname,
        formularioConCambios.description,
        formularioConCambios.fields
      )
      .subscribe(
        (response) => {
          console.log('Formulario actualizado correctamente:', response);
          // Actualizar la descripción en el frontend
          this.formulario.description = formularioConCambios.description;
          // Aquí puedes manejar cualquier lógica adicional después de la actualización
        },
        (error) => {
          console.error('Error al actualizar el formulario:', error);
          // Aquí puedes manejar errores si ocurren durante la actualización
        }
      );
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

    this.closeModalAgregar();

    this.camposService.addNewFormulario(nuevoCampoJSON).subscribe(
      (response) => {
        console.log('Campo añadido correctamente:', response);

        this.closeModalAgregar();
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

    this.closeModal();
  }
}
