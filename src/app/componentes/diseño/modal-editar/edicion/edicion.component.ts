import { Component, Input, Output, EventEmitter } from '@angular/core';

interface Campo {
  nombreCampo: string;
  nombreLabel: string;
  tipo: string;
  validaciones?: any;
}

@Component({
  selector: 'app-edicion',
  templateUrl: './edicion.component.html',
  styleUrls: ['./edicion.component.css'],
})
export class EdicionComponent {
  @Input() campoSeleccionado: Campo | null = null;
  @Output() guardarCambios: EventEmitter<Campo> = new EventEmitter<Campo>();
  modalAbierto = false;

  constructor() {}

  abrirModal() {
    this.modalAbierto = true;
  }

  cerrarModal() {
    this.modalAbierto = false;
  }

  guardar() {
    if (this.campoSeleccionado) {
      // Aquí puedes emitir un evento para pasar los cambios al componente padre
      this.guardarCambios.emit(this.campoSeleccionado);
      this.cerrarModal(); // Cerramos el modal después de guardar
    }
  }
}
