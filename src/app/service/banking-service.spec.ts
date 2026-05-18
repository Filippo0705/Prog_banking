import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { BankingService } from './banking-service';
import {
  API_BASE_URL,
  accountBalanceUrl,
  accountTransactionsUrl,
} from '../testing/banking-test-helpers';

describe('BankingService', () => {
  let service: BankingService;
  let httpMock: HttpTestingController;
  const accountId = 'acc-123';

  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(BankingService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    sessionStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should store and read active account id from sessionStorage', () => {
    service.storeActiveAccountId('  my-account  ');
    expect(service.getActiveAccountId()).toBe('my-account');
  });

  it('should return default account id when sessionStorage is empty', () => {
    expect(service.getActiveAccountId()).toBe('default-account-id');
  });

  it('getBalance should call the Railway balance endpoint', () => {
    service.getBalance(accountId).subscribe((balance) => {
      expect(balance).toEqual({ balance: 1500, currency: 'EUR' });
    });

    const req = httpMock.expectOne(accountBalanceUrl(accountId));
    expect(req.request.method).toBe('GET');
    req.flush({ balance: 1500, currency: 'EUR' });
  });

  it('getAccount should map balance response to Account', () => {
    service.getAccount(accountId).subscribe((account) => {
      expect(account).toEqual({
        id: accountId,
        owner: '',
        iban: accountId,
        balance: 200,
        currency: 'EUR',
      });
    });

    const req = httpMock.expectOne(accountBalanceUrl(accountId));
    req.flush({ balance: 200, currency: 'EUR' });
  });

  it('checkAccountExists should return true when balance request succeeds', () => {
    service.checkAccountExists(accountId).subscribe((exists) => {
      expect(exists).toBe(true);
    });

    const req = httpMock.expectOne(accountBalanceUrl(accountId));
    req.flush({ balance: 1, currency: 'EUR' });
  });

  it('checkAccountExists should return false when balance request fails', () => {
    service.checkAccountExists(accountId).subscribe((exists) => {
      expect(exists).toBe(false);
    });

    const req = httpMock.expectOne(accountBalanceUrl(accountId));
    req.flush('Not found', { status: 404, statusText: 'Not Found' });
  });

  it('getTransactions should call transactions endpoint', () => {
    const mockTx = [
      {
        id: 'tx-1',
        date: '2026-05-10',
        type: 'deposit',
        amount: 100,
        description: 'Deposito',
      },
    ];

    service.getTransactions(accountId).subscribe((txs) => {
      expect(txs).toEqual(mockTx);
    });

    const req = httpMock.expectOne(accountTransactionsUrl(accountId));
    expect(req.request.method).toBe('GET');
    req.flush(mockTx);
  });

  it('getTransactionDetail should call transaction by id endpoint', () => {
    const mockTx = {
      id: 'tx-1',
      date: '2026-05-10',
      type: 'deposit',
      amount: 100,
      description: 'Deposito',
    };

    service.getTransactionDetail(accountId, 'tx-1').subscribe((tx) => {
      expect(tx).toEqual(mockTx);
    });

    const req = httpMock.expectOne(`${accountTransactionsUrl(accountId)}/tx-1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockTx);
  });

  it('deposit should POST to deposits endpoint', () => {
    service.deposit(accountId, 50).subscribe((result) => {
      expect(result.message).toBe('Deposito effettuato');
    });

    const req = httpMock.expectOne(`${API_BASE_URL}/accounts/${accountId}/deposits`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ amount: 50 });
    req.flush({ success: true, message: 'Deposito effettuato' });
  });

  it('withdraw should POST to withdrawals endpoint', () => {
    service.withdraw(accountId, 25).subscribe((result) => {
      expect(result.message).toBe('Prelievo effettuato');
    });

    const req = httpMock.expectOne(`${API_BASE_URL}/accounts/${accountId}/withdrawals`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ amount: 25 });
    req.flush({ success: true, message: 'Prelievo effettuato' });
  });

  it('updateTransaction should PUT transaction body', () => {
    const body = { description: 'Aggiornato' };

    service.updateTransaction(accountId, 'tx-9', body).subscribe((tx) => {
      expect(tx.description).toBe('Aggiornato');
    });

    const req = httpMock.expectOne(`${accountTransactionsUrl(accountId)}/tx-9`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(body);
    req.flush({
      id: 'tx-9',
      date: '2026-05-10',
      type: 'deposit',
      amount: 10,
      description: 'Aggiornato',
    });
  });

  it('deleteTransaction should DELETE transaction', () => {
    service.deleteTransaction(accountId, 'tx-9').subscribe();

    const req = httpMock.expectOne(`${accountTransactionsUrl(accountId)}/tx-9`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('createAccount should POST to accounts', () => {
    const payload = { owner: 'Mario', iban: 'IT123', currency: 'EUR' };

    service.createAccount(payload).subscribe((res) => {
      expect(res).toEqual({ id: 'new-1' });
    });

    const req = httpMock.expectOne(`${API_BASE_URL}/accounts`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush({ id: 'new-1' });
  });

  it('convertCurrency should GET fiat conversion with query params', () => {
    service.convertCurrency(accountId, 'EUR', 'USD', 100).subscribe((result) => {
      expect(result.convertedAmount).toBe(108);
    });

    const req = httpMock.expectOne(
      (r) =>
        r.url === `${API_BASE_URL}/accounts/${accountId}/balance/convert/fiat` &&
        r.params.get('fromCurrency') === 'EUR' &&
        r.params.get('toCurrency') === 'USD' &&
        r.params.get('amount') === '100'
    );
    expect(req.request.method).toBe('GET');
    req.flush({
      fromCurrency: 'EUR',
      toCurrency: 'USD',
      originalAmount: 100,
      convertedAmount: 108,
      rate: 1.08,
    });
  });

  it('convertCrypto should GET crypto conversion with query params', () => {
    service.convertCrypto(accountId, 'EUR', 'BTC', 1000).subscribe((result) => {
      expect(result.toCurrency).toBe('BTC');
    });

    const req = httpMock.expectOne(
      (r) =>
        r.url === `${API_BASE_URL}/accounts/${accountId}/balance/convert/crypto` &&
        r.params.get('fromCurrency') === 'EUR' &&
        r.params.get('cryptoSymbol') === 'BTC' &&
        r.params.get('amount') === '1000'
    );
    expect(req.request.method).toBe('GET');
    req.flush({
      fromCurrency: 'EUR',
      toCurrency: 'BTC',
      originalAmount: 1000,
      convertedAmount: 0.01,
      rate: 0.00001,
    });
  });
});
