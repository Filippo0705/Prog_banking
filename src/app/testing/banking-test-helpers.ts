import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Provider } from '@angular/core';
import { provideRouter } from '@angular/router';
import { environment } from '../../environments/environment';

export const API_BASE_URL = environment.apiUrl.replace(/\/$/, '');

export const bankingTestProviders: Provider[] = [
  provideHttpClient(),
  provideHttpClientTesting(),
  provideRouter([]),
];

export function accountBalanceUrl(accountId: string): string {
  return `${API_BASE_URL}/accounts/${encodeURIComponent(accountId)}/balance`;
}

export function accountTransactionsUrl(accountId: string): string {
  return `${API_BASE_URL}/accounts/${encodeURIComponent(accountId)}/transactions`;
}
