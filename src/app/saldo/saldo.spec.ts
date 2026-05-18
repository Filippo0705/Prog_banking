import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { Saldo } from './saldo';
import { accountBalanceUrl, bankingTestProviders } from '../testing/banking-test-helpers';

describe('Saldo', () => {
  let component: Saldo;
  let fixture: ComponentFixture<Saldo>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Saldo],
      providers: bankingTestProviders,
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(Saldo);
    component = fixture.componentInstance;
    fixture.detectChanges();

    httpMock.expectOne(accountBalanceUrl('default-account-id')).flush({ balance: 500, currency: 'EUR' });
    await fixture.whenStable();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
