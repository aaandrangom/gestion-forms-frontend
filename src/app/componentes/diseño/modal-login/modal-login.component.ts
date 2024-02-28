import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-login',
  template: `
    <div class="modal" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Iniciar Sesión</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <p>{{ message }}</p>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              (click)="activeModal.dismiss()"
            >
              Cancelar
            </button>
            <button
              type="button"
              class="btn btn-primary"
              (click)="activeModal.close()"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./modal-login.component.css'],
})
export class ModalLoginComponent {
  @Input() message: string = '';

  constructor(public activeModal: NgbActiveModal) {}
}
