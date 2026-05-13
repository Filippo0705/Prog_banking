import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BankingService } from '../service/banking-service';

@Component({
  selector: 'app-prelievi',
  imports: [CommonModule, FormsModule],
  templateUrl: './prelievi.html',
  styleUrl: './prelievi.css',
})
export class Prelievi {
  amount = 0;
  resultMessage = '';
  constructor(private bankingService: BankingService) {}

  submitWithdraw(): void {
    if (this.amount <= 0) {
      this.resultMessage = 'Inserisci un importo valido.';
      return;
    }

    this.bankingService.withdraw(this.bankingService.getActiveAccountId(), this.amount).subscribe({
      next: (result) => {
        this.resultMessage = result.message;
      },
      error: () => {
        this.resultMessage = 'Impossibile eseguire il prelievo. Riprova più tardi.';
      },
    });
  }
}
