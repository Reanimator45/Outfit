import { TestBed } from '@angular/core/testing';

import { DecisionEngineService } from './decision-engine.service';

describe('DecisionEngineService', () => {
  let service: DecisionEngineService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DecisionEngineService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
