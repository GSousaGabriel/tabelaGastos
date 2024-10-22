import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolbarTotalsComponent } from './toolbar-totals.component';

describe('ToolbarTotalsComponent', () => {
  let component: ToolbarTotalsComponent;
  let fixture: ComponentFixture<ToolbarTotalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToolbarTotalsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ToolbarTotalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
