import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { BankingService, Transaction } from '../service/banking-service';

@Component({
  selector: 'app-dettaglio-movimenti',
  imports: [CommonModule],
  templateUrl: './dettaglio-movimenti.html',
  styleUrl: './dettaglio-movimenti.css',
})
export class DettaglioMovimenti implements OnInit {
  /** Imposta un id reale quando colleghi la lista movimenti al dettaglio. */
  readonly transactionId = 'sample-transaction-id';
  transaction$!: Observable<Transaction>;

  constructor(private bankingService: BankingService) {}

  ngOnInit(): void {
    this.transaction$ = this.bankingService.getTransactionDetail(
      this.bankingService.getActiveAccountId(),
      this.transactionId
    );
  }
}
