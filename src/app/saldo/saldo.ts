import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { BankingService, Balance } from '../service/banking-service';

@Component({
  selector: 'app-saldo',
  imports: [CommonModule],
  templateUrl: './saldo.html',
  styleUrl: './saldo.css',
})
export class Saldo {
  readonly accountId = 'default-account-id';
  balance$!: Observable<Balance>;

  constructor(private bankingService: BankingService) {
    this.balance$ = this.bankingService.getBalance(this.accountId);
  }
}
