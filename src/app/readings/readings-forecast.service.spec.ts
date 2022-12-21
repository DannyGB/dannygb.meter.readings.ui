import { TestBed } from '@angular/core/testing';

import { ReadingsForecastService } from './readings-forecast.service';

describe('ReadingsForecastService', () => {
  let service: ReadingsForecastService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReadingsForecastService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
