import { async, TestBed } from '@angular/core/testing';
import { BranchesFeatureModule } from './branches-feature.module';

describe('BranchesFeatureModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BranchesFeatureModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(BranchesFeatureModule).toBeDefined();
  });
});
