import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';

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

@Injectable({
  providedIn: 'root',
})
export class BankingService {
  private readonly baseUrl = 'https://api.example.com';

  constructor(private http: HttpClient) {}

  getAccount(iban: string): Observable<Account> {
    return this.http.get<Account>(`${this.baseUrl}/accounts/${iban}`);
  }

  checkAccountExists(iban: string): Observable<boolean> {
    return this.http.get<Account>(`${this.baseUrl}/accounts/${iban}`).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }

  getBalance(accountId: string): Observable<Balance> {
    return this.http.get<Balance>(`${this.baseUrl}/accounts/${accountId}/balance`);
  }

  getTransactions(accountId: string): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.baseUrl}/accounts/${accountId}/transactions`);
  }

  getTransactionDetail(accountId: string, transactionId: string): Observable<Transaction> {
    return this.http.get<Transaction>(`${this.baseUrl}/accounts/${accountId}/transactions/${transactionId}`);
  }

  deposit(accountId: string, amount: number): Observable<OperationResult> {
    return this.http.post<OperationResult>(`${this.baseUrl}/accounts/${accountId}/deposit`, { amount });
  }

  withdraw(accountId: string, amount: number): Observable<OperationResult> {
    return this.http.post<OperationResult>(`${this.baseUrl}/accounts/${accountId}/withdraw`, { amount });
  }

  convertCurrency(
    accountId: string,
    fromCurrency: string,
    toCurrency: string,
    amount: number
  ): Observable<ConversionResult> {
    return this.http.post<ConversionResult>(`${this.baseUrl}/accounts/${accountId}/convert`, {
      fromCurrency,
      toCurrency,
      amount,
    });
  }

  convertCrypto(
    accountId: string,
    fromCurrency: string,
    cryptoSymbol: string,
    amount: number
  ): Observable<ConversionResult> {
    return this.http.post<ConversionResult>(`${this.baseUrl}/accounts/${accountId}/crypto-conversion`, {
      fromCurrency,
      cryptoSymbol,
      amount,
    });
  }
}
