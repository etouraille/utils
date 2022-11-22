import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhoModalComponent } from './who-modal.component';

describe('WhoModalComponent', () => {
  let component: WhoModalComponent;
  let fixture: ComponentFixture<WhoModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WhoModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WhoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
