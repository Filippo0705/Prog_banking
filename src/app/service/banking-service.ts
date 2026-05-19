import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { environment } from '../../environments/environment';

const ACCOUNT_ID_STORAGE_KEY = 'bankingActiveAccountId';

export interface Account {
  id: string;
  owner: string;
  iban: string;
  balance: number;
  currency: string;
}

export interface Balance {
  balance: number;
  currency: string;
}

export interface Transaction {
  id: string;
  date: string;
  type: string;
  amount: number;
  description: string;
  balanceAfter?: number;
}

export interface ConversionResult {
  fromCurrency: string;
  toCurrency: string;
  originalAmount: number;
  convertedAmount: number;
  rate: number;
}

export interface OperationResult {
  success: boolean;
  message: string;
  newBalance?: number;
}

export interface CreateAccountPayload {
  owner: string;
  iban: string;
  currency?: string;
}

@Injectable({
  providedIn: 'root',
})
export class BankingService {
  private readonly baseUrl = environment.apiUrl.replace(/\/$/, '');

  constructor(private http: HttpClient) {}

  storeActiveAccountId(accountId: string): void {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem(ACCOUNT_ID_STORAGE_KEY, accountId.trim());
    }
  }

  getActiveAccountId(): string {
    if (typeof sessionStorage !== 'undefined') {
      const stored = sessionStorage.getItem(ACCOUNT_ID_STORAGE_KEY);
      if (stored) {
        return stored;
      }
    }
    return 'default-account-id';
  }

  private accountUrl(accountId: string, path = ''): string {
    const suffix = path ? `/${path}` : '';
    return `${this.baseUrl}/accounts/${encodeURIComponent(accountId)}${suffix}`;
  }

  /** Sintesi conto da saldo (l'API espone solo `/accounts/{id}/balance` per il saldo). */
  getAccount(accountId: string): Observable<Account> {
    return this.getBalance(accountId).pipe(
      map((b) => ({
        id: accountId,
        owner: '',
        iban: accountId,
        balance: b.balance,
        currency: b.currency,
      }))
    );
  }

  checkAccountExists(accountId: string): Observable<boolean> {
    return this.getBalance(accountId).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }

  createAccount(payload: CreateAccountPayload): Observable<unknown> {
    return this.http.post(`${this.baseUrl}/accounts`, payload);
  }

  getBalance(accountId: string): Observable<Balance> {
    return this.http.get<Balance>(this.accountUrl(accountId, 'balance'));
  }

  getTransactions(accountId: string): Observable<Transaction[]> {
    const url = `${this.baseUrl}/accounts/${accountId}/transactions`;
    return this.http.get<Transaction[]>(url).pipe(map(
      (body : any) => {
        const list = Array.isArray(body) ? body : body.transactions;
        return list.map((tx: Transaction) => this.mapServerTransaction(tx));
      }
    ));
  }

  getTransactionDetail(accountId: string, transactionId: string): Observable<Transaction> {
    return this.http.get<Transaction>(
      `${this.accountUrl(accountId, 'transactions')}/${encodeURIComponent(transactionId)}`
    );
  }

  deposit(accountId: string, amount: number): Observable<OperationResult> {
    return this.http.post<OperationResult>(this.accountUrl(accountId, 'deposits'), { amount });
  }

  withdraw(accountId: string, amount: number): Observable<OperationResult> {
    return this.http.post<OperationResult>(this.accountUrl(accountId, 'withdrawals'), { amount });
  }

  updateTransaction(
    accountId: string,
    transactionId: string,
    body: Partial<Pick<Transaction, 'type' | 'amount' | 'description' | 'date'>>
  ): Observable<Transaction> {
    return this.http.put<Transaction>(
      `${this.accountUrl(accountId, 'transactions')}/${encodeURIComponent(transactionId)}`,
      body
    );
  }

  deleteTransaction(accountId: string, transactionId: string): Observable<void> {
    return this.http.delete<void>(
      `${this.accountUrl(accountId, 'transactions')}/${encodeURIComponent(transactionId)}`
    );
  }

convertCurrency(
  accountId: string,
  fromCurrency: string, // Se l'API non lo usa, puoi rimuoverlo dai parametri
  toCurrency: string,
  amount: number
): Observable<ConversionResult> {
  const url = `${this.baseUrl}/accounts/${accountId}/balance/convert/fiat?to=${encodeURIComponent(toCurrency)}&amount=${amount}`;
  
  return this.http.get<ConversionResult>(url);
}
  convertCrypto(
    accountId: string,
    fromCurrency: string,
    cryptoSymbol: string,
    amount: number
  ): Observable<ConversionResult> {
    const params = new HttpParams()
      .set('fromCurrency', fromCurrency)
      .set('cryptoSymbol', cryptoSymbol)
      .set('amount', String(amount));
    return this.http.get<ConversionResult>(this.accountUrl(accountId, 'balance/convert/crypto'), {
      params,
    });
  }


private mapServerTransaction(tx: Transaction): Transaction {
    const mappedType: Transaction['type'] =
      tx.type === 'deposit' || tx.type === 'withdrawal' ? tx.type : 'other';
    const amountNum = Number(tx.amount);
    const signedAmount = mappedType === 'withdrawal' ? -Math.abs(amountNum) : Math.abs(amountNum);
    return {
      id: String(tx.id),
      date: tx.date ? tx.date.slice(0, 10) : new Date().toISOString().slice(0, 10),
      description: tx.description,
      amount: signedAmount,
      type: mappedType,
    };
  }
}