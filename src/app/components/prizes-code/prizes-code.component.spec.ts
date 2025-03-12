import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrizesCodeComponent } from './prizes-code.component';

describe('PrizesCodeComponent', () => {
  let component: PrizesCodeComponent;
  let fixture: ComponentFixture<PrizesCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrizesCodeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrizesCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
