import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'; // Asegúrate de importar HTTP_INTERCEPTORS aquí
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegistroComponent } from './componentes/autenticacion/registro/registro.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalContentComponent } from './componentes/diseño/modal-content/modal-content.component';
import { LoginComponent } from './componentes/autenticacion/login/login.component';
import { ModalLoginComponent } from './componentes/diseño/modal-login/modal-login.component';
import { VerificarComponent } from './componentes/autenticacion/verificar/verificar.component';
import { ModalVerificarComponent } from './componentes/diseño/modal-verificar/modal-verificar.component';
import { LayoutComponent } from './componentes/usuario/layout/layout.component';
import { Form1Component } from './componentes/usuario/forms/forms.component';
import { JwtInterceptor } from './interceptor/jwt.interceptor';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'; // Asegúrate de que la ruta sea correcta
import { SafeHtmlPipe } from './componentes/diseño/safeHtml/safe-html.pipe';
import { FormulariosHabilitadosComponent } from './componentes/administrador/habilitados/habilitados.component';
import { LayoutAdminComponent } from './componentes/administrador/layout-admin/layout-admin.component';
import { EditarFormComponent } from './componentes/administrador/editar-form/editar-form.component';
import { DeshabilitadosComponent } from './componentes/administrador/deshabilitados/deshabilitados.component';
import { FormularioDetalleComponent } from './componentes/administrador/formulario-detalle/formulario-detalle.component';
import { EdicionComponent } from './componentes/diseño/modal-editar/edicion/edicion.component';
import { CrearFormularioComponent } from './componentes/administrador/crear-formulario/crear-formulario.component';
import { ActividadesComponent } from './componentes/administrador/actividades/actividades.component';
import { PlantillasComponent } from './componentes/administrador/plantillas/plantillas.component';
import { RecuperarContraseniaComponent } from './componentes/autenticacion/recuperar-contrasenia/recuperar-contrasenia.component';
import { OlvidarContraseniaComponent } from './componentes/autenticacion/olvidar-contrasenia/olvidar-contrasenia.component';

@NgModule({
  declarations: [
    AppComponent,
    RegistroComponent,
    ModalContentComponent,
    LoginComponent,
    ModalLoginComponent,
    VerificarComponent,
    ModalVerificarComponent,
    LayoutComponent,
    Form1Component,
    SafeHtmlPipe,
    LayoutAdminComponent,
    FormulariosHabilitadosComponent,
    EditarFormComponent,
    DeshabilitadosComponent,
    FormularioDetalleComponent,
    EdicionComponent,
    CrearFormularioComponent,
    ActividadesComponent,
    PlantillasComponent,
    RecuperarContraseniaComponent,
    OlvidarContraseniaComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    FormsModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true,
    },
    provideAnimationsAsync(),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
