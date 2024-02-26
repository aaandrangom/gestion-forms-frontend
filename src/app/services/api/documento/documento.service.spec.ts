import { TestBed } from '@angular/core/testing';

import { Formulario1Service } from './documento.service';

describe('Formulario1Service', () => {
  let service: Formulario1Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Formulario1Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
