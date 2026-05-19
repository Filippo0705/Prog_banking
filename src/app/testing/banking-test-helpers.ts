import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { environment } from '../../environments/environment';
import { Provider, EnvironmentProviders } from '@angular/core';


export const API_BASE_URL = environment.apiUrl.replace(/\/$/, '');

export const bankingTestProviders: (Provider | EnvironmentProviders)[] = [
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
