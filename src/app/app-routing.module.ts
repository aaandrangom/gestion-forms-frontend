import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistroComponent } from './componentes/registro/registro.component';
import { LoginComponent } from './componentes/login/login.component';
import { VerificarComponent } from './componentes/verificar/verificar.component';
import { LayoutComponent } from './componentes/layout/layout.component';
import { Form1Component } from './componentes/form1/form1.component';
import { AuthGuard } from './guard/auth.guard';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'verificar',
    component: VerificarComponent,
  },
  {
    path: 'principal',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'formulario/:id',
        component: Form1Component,
        canActivate: [AuthGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
