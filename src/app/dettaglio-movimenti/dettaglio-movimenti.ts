import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { BankingService, Transaction } from '../service/banking-service';

@Component({
  selector: 'app-dettaglio-movimenti',
  imports: [CommonModule],
  templateUrl: './dettaglio-movimenti.html',
  styleUrl: './dettaglio-movimenti.css',
})
export class DettaglioMovimenti {
  readonly accountId = 'default-account-id';
  readonly transactionId = 'sample-transaction-id';
  transaction$!: Observable<Transaction>;

  constructor(private bankingService: BankingService) {
    this.transaction$ = this.bankingService.getTransactionDetail(this.accountId, this.transactionId);
  }
}
