import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { DettaglioMovimenti } from './dettaglio-movimenti';
import { accountTransactionsUrl, bankingTestProviders } from '../testing/banking-test-helpers';

describe('DettaglioMovimenti', () => {
  let component: DettaglioMovimenti;
  let fixture: ComponentFixture<DettaglioMovimenti>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DettaglioMovimenti],
      providers: bankingTestProviders,
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(DettaglioMovimenti);
    component = fixture.componentInstance;
    fixture.detectChanges();

    httpMock
      .expectOne(`${accountTransactionsUrl('default-account-id')}/sample-transaction-id`)
      .flush({
        id: 'sample-transaction-id',
        date: '2026-05-10',
        type: 'deposit',
        amount: 100,
        description: 'Test',
      });
    await fixture.whenStable();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
