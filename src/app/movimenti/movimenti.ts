import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { BankingService, Transaction } from '../service/banking-service';

@Component({
  selector: 'app-movimenti',
  imports: [CommonModule],
  templateUrl: './movimenti.html',
  styleUrl: './movimenti.css',
})
export class Movimenti {
  readonly accountId = 'default-account-id';
  transactions$!: Observable<Transaction[]>;

  constructor(private bankingService: BankingService) {
    this.transactions$ = this.bankingService.getTransactions(this.accountId);
  }
}
