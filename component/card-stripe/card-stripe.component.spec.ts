import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardStripeComponent } from './card-stripe.component';

describe('CardStripeComponent', () => {
  let component: CardStripeComponent;
  let fixture: ComponentFixture<CardStripeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardStripeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardStripeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
