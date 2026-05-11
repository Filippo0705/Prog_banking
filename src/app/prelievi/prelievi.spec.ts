import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Prelievi } from './prelievi';

describe('Prelievi', () => {
  let component: Prelievi;
  let fixture: ComponentFixture<Prelievi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Prelievi]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Prelievi);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
