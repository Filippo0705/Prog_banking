import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { ConversioneCrypto } from './conversione-crypto';
import { API_BASE_URL, bankingTestProviders } from '../testing/banking-test-helpers';

describe('ConversioneCrypto', () => {
  let component: ConversioneCrypto;
  let fixture: ComponentFixture<ConversioneCrypto>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConversioneCrypto],
      providers: bankingTestProviders,
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(ConversioneCrypto);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should request crypto conversion when amount is valid', () => {
    component.fromCurrency = 'EUR';
    component.cryptoSymbol = 'BTC';
    component.amount = 1000;
    component.convertCrypto();
    component.conversion$?.subscribe();

    const req = httpMock.expectOne(
      (r) =>
        r.url === `${API_BASE_URL}/accounts/default-account-id/balance/convert/crypto` &&
        r.params.get('cryptoSymbol') === 'BTC'
    );
    req.flush({
      fromCurrency: 'EUR',
      toCurrency: 'BTC',
      originalAmount: 1000,
      convertedAmount: 0.01,
      rate: 0.00001,
    });

    component.conversion$?.subscribe((result) => {
      expect(result.toCurrency).toBe('BTC');
    });
  });
});
