import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavegationbarComponent } from './navegationbar.component';

describe('NavegationbarComponent', () => {
  let component: NavegationbarComponent;
  let fixture: ComponentFixture<NavegationbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavegationbarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavegationbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
