import { async, TestBed } from '@angular/core/testing';
import { BranchesUiComponentsModule } from './branches-ui-components.module';

describe('BranchesUiComponentsModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BranchesUiComponentsModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(BranchesUiComponentsModule).toBeDefined();
  });
});
