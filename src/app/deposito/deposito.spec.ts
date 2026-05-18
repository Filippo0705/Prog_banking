import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { Deposito } from './deposito';
import { API_BASE_URL, bankingTestProviders } from '../testing/banking-test-helpers';

describe('Deposito', () => {
  let component: Deposito;
  let fixture: ComponentFixture<Deposito>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Deposito],
      providers: bankingTestProviders,
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(Deposito);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reject invalid amount', () => {
    component.amount = 0;
    component.submitDeposit();
    expect(component.resultMessage).toBe('Inserisci un importo valido.');
    httpMock.expectNone(`${API_BASE_URL}/accounts/default-account-id/deposits`);
  });

  it('should call deposit API on valid amount', () => {
    component.amount = 100;
    component.submitDeposit();

    const req = httpMock.expectOne(`${API_BASE_URL}/accounts/default-account-id/deposits`);
    expect(req.request.body).toEqual({ amount: 100 });
    req.flush({ success: true, message: 'Deposito registrato' });

    expect(component.resultMessage).toBe('Deposito registrato');
  });
});
