import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { BankingService, ConversionResult } from '../service/banking-service';

@Component({
  selector: 'app-conversione',
  imports: [CommonModule, FormsModule],
  templateUrl: './conversione.html',
  styleUrl: './conversione.css',
})
export class Conversione {
  fromCurrency = 'EUR';
  toCurrency = 'USD';
  amount = 0;
  conversion$?: Observable<ConversionResult>;

  constructor(private bankingService: BankingService) {}

  convert(): void {
    if (this.amount <= 0 || this.fromCurrency === this.toCurrency) {
      return;
    }

    this.conversion$ = this.bankingService.convertCurrency(
      this.bankingService.getActiveAccountId(),
      this.fromCurrency,
      this.toCurrency,
      this.amount
    );
  }
}
