import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegistroComponent } from './componentes/registro/registro.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalContentComponent } from './componentes/modal-content/modal-content.component';
import { LoginComponent } from './componentes/login/login.component';
import { ModalLoginComponent } from './componentes/modal-login/modal-login.component';
import { VerificarComponent } from './componentes/verificar/verificar.component';
import { ModalVerificarComponent } from './componentes/modal-verificar/modal-verificar.component';

@NgModule({
  declarations: [
    AppComponent,
    RegistroComponent,
    ModalContentComponent,
    LoginComponent,
    ModalLoginComponent,
    VerificarComponent,
    ModalVerificarComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
