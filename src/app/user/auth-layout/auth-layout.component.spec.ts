import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthLayoutComponent } from './auth-layout.component';

describe('AuthLayoutComponent', () => {
  let fixture: ComponentFixture<AuthLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthLayoutComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(AuthLayoutComponent);
    fixture.componentRef.setInput('heading', 'Welcome back');
    fixture.componentRef.setInput('subheading', 'Log in to continue.');
    fixture.detectChanges();
  });

  it('should render the heading and subheading', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Welcome back');
    expect(compiled.textContent).toContain('Log in to continue.');
  });
});
