import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { BankingService, ConversionResult } from '../service/banking-service';

@Component({
  selector: 'app-conversione-crypto',
  imports: [CommonModule, FormsModule],
  templateUrl: './conversione-crypto.html',
  styleUrl: './conversione-crypto.css',
})
export class ConversioneCrypto {
  fromCurrency = 'EUR';
  cryptoSymbol = 'BTC';
  amount = 0;
  conversion$?: Observable<ConversionResult>;

  constructor(private bankingService: BankingService) {}

  convertCrypto(): void {
    if (this.amount <= 0) {
      return;
    }

    this.conversion$ = this.bankingService.convertCrypto(
      this.bankingService.getActiveAccountId(),
      this.fromCurrency,
      this.cryptoSymbol,
      this.amount
    );
  }
}
