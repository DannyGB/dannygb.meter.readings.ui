import { TestBed } from '@angular/core/testing';

import { OilReadingsListService } from './oil-readings-list.service';

describe('OilReadingsListService', () => {
  let service: OilReadingsListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OilReadingsListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
