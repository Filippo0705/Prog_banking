import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { HomePage } from './home-page';
import { BankingService } from '../service/banking-service';
import {
  accountBalanceUrl,
  bankingTestProviders,
} from '../testing/banking-test-helpers';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;
  let httpMock: HttpTestingController;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomePage],
      providers: bankingTestProviders,
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
    sessionStorage.clear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show error when account number is empty', () => {
    component.accountNumber = '   ';
    component.validateAccount();
    expect(component.errorMessage).toBe('Inserisci un codice conto valido.');
  });

  it('should navigate to conto when account exists', () => {
    const accountId = 'IT60X0542811101000000123456';
    component.accountNumber = accountId;
    component.validateAccount();

    const req = httpMock.expectOne(accountBalanceUrl(accountId));
    req.flush({ balance: 100, currency: 'EUR' });

    expect(component.loading).toBe(false);
    expect(component.errorMessage).toBe('');
    expect(TestBed.inject(BankingService).getActiveAccountId()).toBe(accountId);
    expect(router.navigate).toHaveBeenCalledWith(['/conto']);
  });

  it('should show error when account does not exist', () => {
    component.accountNumber = 'invalid-id';
    component.validateAccount();

    const req = httpMock.expectOne(accountBalanceUrl('invalid-id'));
    req.flush('Not found', { status: 404, statusText: 'Not Found' });

    expect(component.loading).toBe(false);
    expect(component.errorMessage).toBe('Il conto inserito non esiste.');
  });
});
