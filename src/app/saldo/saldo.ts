import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { BankingService, Balance } from '../service/banking-service';

@Component({
  selector: 'app-saldo',
  imports: [CommonModule],
  templateUrl: './saldo.html',
  styleUrl: './saldo.css',
})
export class Saldo implements OnInit {
  balance$!: Observable<Balance>;

  constructor(private bankingService: BankingService) {}

  ngOnInit(): void {
    this.balance$ = this.bankingService.getBalance(this.bankingService.getActiveAccountId());
  }
}
