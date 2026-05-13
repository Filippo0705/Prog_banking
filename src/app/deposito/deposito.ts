import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BankingService } from '../service/banking-service';

@Component({
  selector: 'app-deposito',
  imports: [CommonModule, FormsModule],
  templateUrl: './deposito.html',
  styleUrl: './deposito.css',
})
export class Deposito {
  amount = 0;
  resultMessage = '';
  constructor(private bankingService: BankingService) {}

  submitDeposit(): void {
    if (this.amount <= 0) {
      this.resultMessage = 'Inserisci un importo valido.';
      return;
    }

    this.bankingService.deposit(this.bankingService.getActiveAccountId(), this.amount).subscribe({
      next: (result) => {
        this.resultMessage = result.message;
      },
      error: () => {
        this.resultMessage = 'Impossibile effettuare il deposito. Riprova più tardi.';
      },
    });
  }
}
