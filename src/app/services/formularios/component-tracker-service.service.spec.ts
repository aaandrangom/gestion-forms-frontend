import { TestBed } from '@angular/core/testing';

import { ComponentTrackerServiceService } from './component-tracker-service.service';

describe('ComponentTrackerServiceService', () => {
  let service: ComponentTrackerServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComponentTrackerServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
