/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PublicService } from './public.service';

describe('Service: Public', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PublicService]
    });
  });

  it('should ...', inject([PublicService], (service: PublicService) => {
    expect(service).toBeTruthy();
  }));
});
