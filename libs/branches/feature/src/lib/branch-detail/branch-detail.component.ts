import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'idc-branch-detail',
  templateUrl: './branch-detail.component.html',
  styleUrls: ['./branch-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BranchDetailComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
