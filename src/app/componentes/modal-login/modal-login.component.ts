import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-login',
  template: `
    <div class="modal-header">
      <h4 class="modal-title">Iniciar Sesión</h4>
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
  styleUrl: './modal-login.component.css',
})
export class ModalLoginComponent {
  @Input() message: string = '';

  constructor(public activeModal: NgbActiveModal) {}
}
