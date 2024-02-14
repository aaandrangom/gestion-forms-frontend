import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Formulario1Service } from '../../services/api/formulario1/formulario1.service';
import { FormulariosService } from '../../services/api/formularios/formularios.service';
import { RespuestasService } from '../../services/api/respuestas/respuestas.service';
import { ComponentTrackerServiceService } from '../../services/formularios/component-tracker-service.service';

@Component({
  selector: 'app-form1',
  templateUrl: './form1.component.html',
  styleUrls: ['./form1.component.css'],
})
export class Form1Component implements OnInit, OnDestroy {
  formGroup: FormGroup | null = null;
  selectedImages: { [formId: number]: File | null } = {};
  formTemplate: any;
  cedula: string | null = null;
  private componentTrackerSubscription: Subscription | undefined;

  constructor(
    private formBuilder: FormBuilder,
    private formulario1Service: Formulario1Service,
    private route: ActivatedRoute,
    private formularioService: FormulariosService,
    private respuestasService: RespuestasService,
    private tracker: ComponentTrackerServiceService
  ) {}

  ngOnInit() {
    this.cedula = localStorage.getItem('cedula');
    console.log(this.cedula);
    this.loadFormData();

    this.componentTrackerSubscription =
      this.tracker.currentComponentName$.subscribe((componentName) => {
        this.loadFormData();
      });

    console.log('Campos del formulario:', this.getFieldsKeys());
  }

  ngOnDestroy() {
    this.componentTrackerSubscription?.unsubscribe();
  }

  loadFormData() {
    const currentComponent = this.tracker.getCurrentComponent();
    this.formularioService
      .getForm({ templatename: currentComponent })
      .subscribe({
        next: (response) => {
          this.formTemplate = response;
          this.initializeForm();
          this.loadData();
        },
        error: (error) => {
          console.error('Error al cargar el formulario', error);
        },
      });
  }

  initializeForm() {
    const formControls: any = {};
    if (
      this.formTemplate.fields &&
      typeof this.formTemplate.fields === 'object'
    ) {
      const fieldsArray = Object.entries(this.formTemplate.fields);
      for (const [fieldName, fieldValue] of fieldsArray) {
        formControls[fieldName] = [fieldValue, Validators.required];
      }
    }
    this.formGroup = this.formBuilder.group(formControls);
  }

  loadData() {
    if (this.cedula && this.formTemplate && this.formTemplate.formid) {
      this.respuestasService
        .getResponsesByCedulaAndFormId(this.cedula, this.formTemplate.formid)
        .subscribe({
          next: (response) => {
            if (response && response.responsedata) {
              const responseData = response.responsedata;
              if (responseData) {
                this.formGroup?.patchValue(responseData);
              } else {
                console.log(
                  'responseData es null, considera inicializar el formulario con valores por defecto.'
                );
              }
            } else {
              console.log(
                'No se encontraron datos de respuesta, considera inicializar el formulario con valores por defecto.'
              );
            }
          },
          error: (error) => {
            console.error('Error al cargar los datos:', error);
            if (error.status === 404) {
              console.error('No se encontró el recurso solicitado.');
            }
          },
        });
    } else {
      console.error(
        'La cédula o la plantilla de formulario no están disponibles'
      );
    }
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      const selectedFile = event.target.files[0];
      this.formGroup?.get('imagePath')?.setValue(selectedFile.name);
      this.selectedImages[this.formTemplate.formid] = selectedFile;
    }
  }

  onSubmit() {
    const siValue = this.formGroup?.get('si')?.value;
    const noValue = this.formGroup?.get('no')?.value;
    if (siValue === true) {
      this.formGroup?.get('si')?.setValue('X');
      this.formGroup?.get('no')?.setValue('');
    } else if (noValue === true) {
      this.formGroup?.get('si')?.setValue('');
      this.formGroup?.get('no')?.setValue('X');
    }
    this.formGroup?.get('si')?.setValidators(null);
    this.formGroup?.get('no')?.setValidators(null);
    this.formGroup?.get('si')?.updateValueAndValidity();
    this.formGroup?.get('no')?.updateValueAndValidity();
    if (
      this.formGroup?.valid &&
      this.selectedImages[this.formTemplate.formid] !== null
    ) {
      this.formulario1Service
        .uploadImage(this.selectedImages[this.formTemplate.formid] as File)
        .subscribe({
          next: (response) => {
            const documentData = this.formGroup?.value;
            documentData.templateKey = this.tracker.getCurrentComponent();
            documentData.imagePath = response.fileName;
            this.createDocument(documentData);
          },
          error: (err) => {
            console.error('Error al subir la imagen', err);
          },
        });
    } else {
      console.error('El formulario no es válido o falta la imagen');
    }
  }

  createDocument(documentData: any) {
    this.formulario1Service.createDocument(documentData).subscribe({
      next: (response) => {
        this.handleResponse(response);
        this.saveResponses(documentData);
      },
      error: (error) => {
        console.error('Error al generar el documento', error);
      },
    });
  }

  saveResponses(documentData: any) {
    this.respuestasService
      .insertResponses({
        cedula: this.cedula!,
        formid: this.formTemplate.formid,
        responsedata: documentData,
      })
      .subscribe({
        next: (response) => {
          console.log(response);
        },
        error: (error) => {
          console.error('Error al insertar respuestas', error);
        },
      });
  }

  handleResponse(response: Blob) {
    const url = window.URL.createObjectURL(response);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'Formulario_' + this.formTemplate.formname + '.docx';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    console.log('Documento generado con éxito');
  }

  getFieldsKeys(): string[] {
    return Object.keys(this.formTemplate?.fields || {}) as string[];
  }

  getFieldErrorMessage(fieldName: string): string {
    if (this.formGroup) {
      const field = this.formGroup.get(fieldName);
      if (field) {
        if (
          field.errors &&
          field.errors['required'] &&
          (field.value === null || field.value === false)
        ) {
          return `${
            fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
          } es obligatorio.`;
        }
      }
    }
    return '';
  }

  onCheckboxChange(fieldName: string, event: any) {
    if (event.target.checked) {
      if (fieldName === 'si') {
        this.formGroup?.get('no')?.setValue('');
      } else if (fieldName === 'no') {
        this.formGroup?.get('si')?.setValue('');
      }
    }
  }

  isDateField(fieldName: string): boolean {
    console.log(fieldName.toLowerCase().includes('fecha'));
    return fieldName.toLowerCase().includes('fecha');
  }
}
