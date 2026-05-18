import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { Conversione } from './conversione';
import { API_BASE_URL, bankingTestProviders } from '../testing/banking-test-helpers';

describe('Conversione', () => {
  let component: Conversione;
  let fixture: ComponentFixture<Conversione>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Conversione],
      providers: bankingTestProviders,
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(Conversione);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not convert when amount is invalid', () => {
    component.amount = 0;
    component.convert();
    expect(component.conversion$).toBeUndefined();
    httpMock.expectNone(`${API_BASE_URL}/accounts/default-account-id/balance/convert/fiat`);
  });

  it('should request fiat conversion when form is valid', () => {
    component.fromCurrency = 'EUR';
    component.toCurrency = 'USD';
    component.amount = 100;
    component.convert();
    component.conversion$?.subscribe();

    const req = httpMock.expectOne(
      (r) =>
        r.url === `${API_BASE_URL}/accounts/default-account-id/balance/convert/fiat` &&
        r.params.get('fromCurrency') === 'EUR' &&
        r.params.get('toCurrency') === 'USD' &&
        r.params.get('amount') === '100'
    );
    req.flush({
      fromCurrency: 'EUR',
      toCurrency: 'USD',
      originalAmount: 100,
      convertedAmount: 108,
      rate: 1.08,
    });

    component.conversion$?.subscribe((result) => {
      expect(result.convertedAmount).toBe(108);
    });
  });
});
