import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { BankingService, Transaction } from '../service/banking-service';

@Component({
  selector: 'app-movimenti',
  imports: [CommonModule],
  templateUrl: './movimenti.html',
  styleUrl: './movimenti.css',
})
export class Movimenti implements OnInit {
  transactions$!: Observable<Transaction[]>;

  constructor(private bankingService: BankingService) {}

  ngOnInit(): void {
    this.transactions$ = this.bankingService.getTransactions(this.bankingService.getActiveAccountId());
  }
}
