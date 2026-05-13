import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, map } from 'rxjs';
import { Navbar } from '../navbar/navbar';
import { BankingService, Account, Transaction } from '../service/banking-service';

@Component({
  selector: 'app-conto',
  imports: [Navbar, CommonModule],
  templateUrl: './conto.html',
  styleUrl: './conto.css',
})
export class Conto implements OnInit {
  readonly todayLabel = new Intl.DateTimeFormat('it-IT', {
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(new Date());

  account$!: Observable<Account>;
  transactions$!: Observable<Transaction[]>;

  constructor(private bankingService: BankingService) {}

  ngOnInit(): void {
    const accountId = this.bankingService.getActiveAccountId();
    this.account$ = this.bankingService.getAccount(accountId);
    this.transactions$ = this.bankingService
      .getTransactions(accountId)
      .pipe(map((txs) => txs.slice(0, 5)));
  }
}
