import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-verificar',
  template: `
    <div
      class="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4"
    >
      <div class="relative bg-white rounded-2xl shadow-2xl mx-auto max-w-md">
        <div class="absolute top-4 right-4">
          <button
            type="button"
            class="text-gray-400 hover:text-gray-600"
            (click)="activeModal.close()"
          >
            <span class="sr-only">Cerrar</span>
            <svg
              class="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div class="p-6 text-center">
          <h3 class="text-xl font-semibold text-gray-900 mb-4">
            Código de verificación
          </h3>
          <p class="text-gray-500 mb-6">{{ message }}</p>
          <div class="flex justify-center gap-4">
            <button
              type="button"
              class="px-4 py-2 text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200"
              (click)="activeModal.dismiss()"
            >
              Cancelar
            </button>
            <button
              type="button"
              class="px-4 py-2 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              (click)="activeModal.close()"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./modal-verificar.component.css'],
})
export class ModalVerificarComponent {
  @Input() message: string = '';

  constructor(public activeModal: NgbActiveModal) {}
}
