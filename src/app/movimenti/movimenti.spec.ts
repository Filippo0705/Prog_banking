import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { Movimenti } from './movimenti';
import { accountTransactionsUrl, bankingTestProviders } from '../testing/banking-test-helpers';

describe('Movimenti', () => {
  let component: Movimenti;
  let fixture: ComponentFixture<Movimenti>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Movimenti],
      providers: bankingTestProviders,
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(Movimenti);
    component = fixture.componentInstance;
    fixture.detectChanges();

    httpMock.expectOne(accountTransactionsUrl('default-account-id')).flush([]);
    await fixture.whenStable();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
