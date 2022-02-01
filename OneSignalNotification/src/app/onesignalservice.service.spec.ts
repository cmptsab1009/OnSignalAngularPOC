import { TestBed } from '@angular/core/testing';

import { OnesignalserviceService } from './onesignalservice.service';

describe('OnesignalserviceService', () => {
  let service: OnesignalserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OnesignalserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
