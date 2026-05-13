import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversioneCrypto } from './conversione-crypto';

describe('ConversioneCrypto', () => {
  let component: ConversioneCrypto;
  let fixture: ComponentFixture<ConversioneCrypto>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConversioneCrypto]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConversioneCrypto);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
