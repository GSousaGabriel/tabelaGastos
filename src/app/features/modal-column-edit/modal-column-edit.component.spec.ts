import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalColumnEditComponent } from './modal-column-edit.component';

describe('ModalColumnEditComponent', () => {
  let component: ModalColumnEditComponent;
  let fixture: ComponentFixture<ModalColumnEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalColumnEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalColumnEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
