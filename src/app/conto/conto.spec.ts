import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { Conto } from './conto';
import {
  accountBalanceUrl,
  accountTransactionsUrl,
  bankingTestProviders,
} from '../testing/banking-test-helpers';

describe('Conto', () => {
  let component: Conto;
  let fixture: ComponentFixture<Conto>;
  let httpMock: HttpTestingController;
  const accountId = 'default-account-id';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Conto],
      providers: bankingTestProviders,
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(Conto);
    component = fixture.componentInstance;
    fixture.detectChanges();

    httpMock.expectOne(accountBalanceUrl(accountId)).flush({ balance: 12450.9, currency: 'EUR' });
    httpMock.expectOne(accountTransactionsUrl(accountId)).flush([
      {
        id: 'tx-1',
        date: '10 Maggio 2026',
        type: 'income',
        amount: 1250,
        description: 'Bonifico Ricevuto',
      },
    ]);
    await fixture.whenStable();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load account and transactions on init', () => {
    expect(component.account$).toBeTruthy();
    expect(component.transactions$).toBeTruthy();
  });
});
