import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalVerificarComponent } from './modal-verificar.component';

describe('ModalVerificarComponent', () => {
  let component: ModalVerificarComponent;
  let fixture: ComponentFixture<ModalVerificarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalVerificarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalVerificarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
