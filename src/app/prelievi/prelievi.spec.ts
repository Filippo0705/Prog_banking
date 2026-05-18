import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { Prelievi } from './prelievi';
import { API_BASE_URL, bankingTestProviders } from '../testing/banking-test-helpers';

describe('Prelievi', () => {
  let component: Prelievi;
  let fixture: ComponentFixture<Prelievi>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Prelievi],
      providers: bankingTestProviders,
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(Prelievi);
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
    component.amount = -10;
    component.submitWithdraw();
    expect(component.resultMessage).toBe('Inserisci un importo valido.');
    httpMock.expectNone(`${API_BASE_URL}/accounts/default-account-id/withdrawals`);
  });

  it('should call withdrawal API on valid amount', () => {
    component.amount = 50;
    component.submitWithdraw();

    const req = httpMock.expectOne(`${API_BASE_URL}/accounts/default-account-id/withdrawals`);
    expect(req.request.body).toEqual({ amount: 50 });
    req.flush({ success: true, message: 'Prelievo registrato' });

    expect(component.resultMessage).toBe('Prelievo registrato');
  });
});
