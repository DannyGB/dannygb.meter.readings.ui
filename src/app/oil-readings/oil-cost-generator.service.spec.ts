import { TestBed } from '@angular/core/testing';

import { OilCostGeneratorService } from './oil-cost-generator.service';

describe('OilCostGeneratorService', () => {
  let service: OilCostGeneratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OilCostGeneratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
