import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardGamesComponent } from './card-games.component';

describe('CardGamesComponent', () => {
  let component: CardGamesComponent;
  let fixture: ComponentFixture<CardGamesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardGamesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardGamesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
