import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistroComponent } from './componentes/autenticacion/registro/registro.component';
import { LoginComponent } from './componentes/autenticacion/login/login.component';
import { VerificarComponent } from './componentes/autenticacion/verificar/verificar.component';
import { LayoutComponent } from './componentes/usuario/layout/layout.component';
import { Form1Component } from './componentes/usuario/forms/forms.component';
import { AuthGuard } from './guard/auth.guard';
import { LayoutAdminComponent } from './componentes/administrador/layout-admin/layout-admin.component';
import { FormulariosHabilitadosComponent } from './componentes/administrador/habilitados/habilitados.component';
import { DeshabilitadosComponent } from './componentes/administrador/deshabilitados/deshabilitados.component';
import { FormularioDetalleComponent } from './componentes/administrador/formulario-detalle/formulario-detalle.component';
import { CrearFormularioComponent } from './componentes/administrador/crear-formulario/crear-formulario.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'login', component: LoginComponent },
  { path: 'verificar', component: VerificarComponent },
  {
    path: 'principal',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'formulario', pathMatch: 'full' },
      { path: 'formulario', component: Form1Component },
      { path: 'formulario/:id', component: Form1Component },
    ],
  },
  {
    path: 'administrador',
    component: LayoutAdminComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'formularioshabilitados', pathMatch: 'full' },
      {
        path: 'formularioshabilitados',
        component: FormulariosHabilitadosComponent,
      },
      {
        path: 'formularioshabilitados/formulario/:id',
        component: FormularioDetalleComponent,
      },
      {
        path: 'formulariosdeshabilitados',
        component: DeshabilitadosComponent,
      },
      {
        path: 'crear-formulario',
        component: CrearFormularioComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
