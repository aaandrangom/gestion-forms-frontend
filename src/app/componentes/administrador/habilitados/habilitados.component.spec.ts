import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormulariosHabilitadosComponent } from './habilitados.component';

describe('HabilitadosComponent', () => {
  let component: FormulariosHabilitadosComponent;
  let fixture: ComponentFixture<FormulariosHabilitadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormulariosHabilitadosComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FormulariosHabilitadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
