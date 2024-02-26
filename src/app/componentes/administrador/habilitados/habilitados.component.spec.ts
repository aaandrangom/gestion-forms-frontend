import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HabilitadosComponent } from './habilitados.component';

describe('HabilitadosComponent', () => {
  let component: HabilitadosComponent;
  let fixture: ComponentFixture<HabilitadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HabilitadosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HabilitadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
