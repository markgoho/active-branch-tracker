import { async, TestBed } from '@angular/core/testing';
import { JobsDataAccessModule } from './jobs-data-access.module';

describe('JobsDataAccessModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [JobsDataAccessModule],
    }).compileComponents();
  }));

  it('should create', () => {
    expect(JobsDataAccessModule).toBeDefined();
  });
});
