import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrizesFlexComponent } from './prizes-flex.component';

describe('PrizesFlexComponent', () => {
  let component: PrizesFlexComponent;
  let fixture: ComponentFixture<PrizesFlexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrizesFlexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrizesFlexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
