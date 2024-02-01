import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-content',
  template: `
    <div class="modal-header">
      <h4 class="modal-title">Mensaje de Registro</h4>
      <button
        type="button"
        class="close"
        aria-label="Cerrar"
        (click)="activeModal.close()"
      >
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      {{ message }}
    </div>
    <div class="modal-footer">
      <button
        type="button"
        class="btn btn-secondary"
        (click)="activeModal.close()"
      >
        Cerrar
      </button>
    </div>
  `,
})
export class ModalContentComponent {
  @Input() message: string = '';

  constructor(public activeModal: NgbActiveModal) {}
}
