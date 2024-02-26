import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeshabilitadosComponent } from './deshabilitados.component';

describe('DeshabilitadosComponent', () => {
  let component: DeshabilitadosComponent;
  let fixture: ComponentFixture<DeshabilitadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeshabilitadosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeshabilitadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
