import { Component } from '@angular/core';
import { AuthService } from '../../../services/autenticacion/auth.service';
import { FormulariosService } from '../../../services/api/formularios/formularios.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout-admin',
  templateUrl: './layout-admin.component.html',
  styleUrl: './layout-admin.component.css',
})
export class LayoutAdminComponent {
  isFormOptionsVisible: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  toggleFormOptions() {
    this.isFormOptionsVisible = !this.isFormOptionsVisible;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
