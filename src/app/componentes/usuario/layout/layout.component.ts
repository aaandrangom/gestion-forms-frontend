import { Component } from '@angular/core';
import { ComponentTrackerServiceService } from '../../../services/formularios/component-tracker-service.service';
import { FormulariosService } from '../../../services/api/formularios/formularios.service';
import { AuthService } from '../../../services/autenticacion/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export class LayoutComponent {
  isFormOptionsVisible: boolean = false;
  formularios: any[] = [];
  constructor(
    public componentTracker: ComponentTrackerServiceService,
    private formulariosService: FormulariosService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getFormularios();
  }

  toggleFormOptions() {
    this.isFormOptionsVisible = !this.isFormOptionsVisible;
  }

  getTemplateName() {}

  getFormularios() {
    this.formulariosService.getAllForm().subscribe(
      (data) => {
        this.formularios = data;
      },
      (error) => {}
    );
  }

  setCurrentComponent(name: string) {
    this.componentTracker.setCurrentComponentName(name);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
