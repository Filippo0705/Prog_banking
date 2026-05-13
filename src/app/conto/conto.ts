import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Navbar } from '../navbar/navbar';
import { BankingService, Account, Transaction } from '../service/banking-service';

@Component({
  selector: 'app-conto',
  imports: [Navbar, CommonModule],
  templateUrl: './conto.html',
  styleUrl: './conto.css',
})
export class Conto implements OnInit {
  readonly accountIban = 'IT60X0542811101000000123456';
  readonly accountId = 'default-account-id';

  account$!: Observable<Account>;
  transactions$!: Observable<Transaction[]>;

  constructor(private bankingService: BankingService) {}

  ngOnInit(): void {
    this.account$ = this.bankingService.getAccount(this.accountIban);
    this.transactions$ = this.bankingService.getTransactions(this.accountId);
  }
}
