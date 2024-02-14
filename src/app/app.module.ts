import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'; // Asegúrate de importar HTTP_INTERCEPTORS aquí
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegistroComponent } from './componentes/registro/registro.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalContentComponent } from './componentes/modal-content/modal-content.component';
import { LoginComponent } from './componentes/login/login.component';
import { ModalLoginComponent } from './componentes/modal-login/modal-login.component';
import { VerificarComponent } from './componentes/verificar/verificar.component';
import { ModalVerificarComponent } from './componentes/modal-verificar/modal-verificar.component';
import { LayoutComponent } from './componentes/layout/layout.component';
import { Form1Component } from './componentes/form1/form1.component';
import { JwtInterceptor } from './interceptor/jwt.interceptor'; // Asegúrate de que la ruta sea correcta

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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS, // Indica que estás proporcionando un interceptor HTTP
      useClass: JwtInterceptor, // La clase del interceptor
      multi: true, // Permite múltiples interceptores
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
