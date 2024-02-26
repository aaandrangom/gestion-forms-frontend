import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Formulario1Service } from '../../../services/api/documento/documento.service';
import { FormulariosService } from '../../../services/api/formularios/formularios.service';
import { RespuestasService } from '../../../services/api/respuestas/respuestas.service';
import { ComponentTrackerServiceService } from '../../../services/formularios/component-tracker-service.service';

@Component({
  selector: 'app-form1',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.css'],
})
export class Form1Component implements OnInit, OnDestroy {
  formGroup: FormGroup | null = null;
  selectedImages: { [formId: number]: File | null } = {};
  formTemplate: any;
  cedula: string | null = null;
  nombreImagen: string | null = null;
  private componentTrackerSubscription: Subscription | undefined;

  constructor(
    private formBuilder: FormBuilder,
    private formulario1Service: Formulario1Service,
    private formularioService: FormulariosService,
    private respuestasService: RespuestasService,
    private tracker: ComponentTrackerServiceService
  ) {}

  ngOnInit() {
    this.cedula = localStorage.getItem('cedula');
    this.loadFormData();

    this.componentTrackerSubscription =
      this.tracker.currentComponentName$.subscribe((componentName) => {
        this.loadFormData();
      });
  }

  ngOnDestroy() {
    this.componentTrackerSubscription?.unsubscribe();
  }

  loadFormData() {
    let currentComponent = this.tracker.getCurrentComponent();

    if (currentComponent === null) {
      currentComponent = 'template1';
      this.tracker.setCurrentComponentName(currentComponent);
    }

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
      const fieldsArray = Object.values(this.formTemplate.fields) as string[];
      for (const fieldValue of fieldsArray) {
        formControls[fieldValue] = [null];
      }

      // Modificar la validación según las condiciones
      if ('si' in this.formTemplate.fields && formControls['si']) {
        formControls['si'].push(Validators.required);
      }
      if ('no' in this.formTemplate.fields && formControls['no']) {
        formControls['no'].push(Validators.required);
      }

      fieldsArray.forEach((fieldValue) => {
        formControls[fieldValue].push(Validators.required);
      });
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
                const formValues: any = {};
                Object.keys(responseData).forEach((key) => {
                  const fieldValue = this.formTemplate.fields[key];
                  if (fieldValue) {
                    formValues[fieldValue] = responseData[key];
                  }
                });
                this.formGroup?.patchValue(formValues);
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
          error: (error) => {},
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
      this.formGroup?.get('Logo')?.setValue(selectedFile.name);
      this.selectedImages[this.formTemplate.formid] = selectedFile;
    }
  }

  onSubmit() {
    if (
      this.formGroup?.valid &&
      this.selectedImages[this.formTemplate.formid] !== null
    ) {
      this.formulario1Service
        .uploadImage(this.selectedImages[this.formTemplate.formid] as File)
        .subscribe({
          next: (response) => {
            this.nombreImagen = '';
            const documentData: any = {};
            for (const fieldName of Object.keys(this.formGroup?.value)) {
              const actualFieldName = Object.keys(
                this.formTemplate.fields
              ).find((key) => this.formTemplate.fields[key] === fieldName);
              documentData[actualFieldName || fieldName] =
                this.formGroup?.get(fieldName)?.value;
            }
            documentData.templateKey = this.tracker.getCurrentComponent();
            documentData.imagePath = response.fileName;
            this.createDocument(documentData);
          },
          error: (err) => {
            this.nombreImagen = 'Debe seleccionar una imagen';
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
        if (error.errors) {
          console.log(error.errors);
          const errorMessage = error.errors
            .map((err: any) => `-Error: ${err.mensaje}`)
            .join('<br>');

          this.nombreImagen = `Bloque de errores: <br>${errorMessage}`;
        } else {
          console.error('Error al generar el documento:', error.message);
        }
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

    const fileInput = document.getElementById('logoInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  getFieldsValues(): string[] {
    return Object.values(this.formTemplate?.fields || {}) as string[];
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

  getFieldLabel(fieldName: string): string {
    return this.formTemplate?.fields[fieldName] || '';
  }

  isDateField(fieldName: string): boolean {
    return fieldName.toLowerCase().includes('fecha');
  }
}
