import { TestBed } from '@angular/core/testing';

import { OilReadingsService } from './oil-readings.service';

describe('OilReadingsService', () => {
  let service: OilReadingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OilReadingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
