import { Directive, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

@Directive()
export abstract class WorkflowBaseComponent
  implements OnInit, OnChanges, OnDestroy
{
  protected destroy$ = new Subject<void>();

  constructor() {}

  abstract ngOnInit(): void;

  abstract ngOnChanges(): void;

  goNext(){}

  goback(){}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
