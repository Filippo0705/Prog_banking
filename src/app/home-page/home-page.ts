import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Navbar } from '../navbar/navbar';
import { BankingService } from '../service/banking-service';

@Component({
  selector: 'app-home-page',
  imports: [Navbar, CommonModule, FormsModule],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage {
  accountNumber = '';
  errorMessage = '';
  loading = false;

  constructor(private bankingService: BankingService, private router: Router) {}

  validateAccount(): void {
    this.errorMessage = '';
    const iban = this.accountNumber.trim();

    if (!iban) {
      this.errorMessage = 'Inserisci un codice conto valido.';
      return;
    }

    this.loading = true;
    this.bankingService.checkAccountExists(iban).subscribe({
      next: (exists) => {
        this.loading = false;
        if (exists) {
          this.router.navigate(['/conto']);
        } else {
          this.errorMessage = 'Il conto inserito non esiste.';
        }
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Errore di connessione. Riprova più tardi.';
      },
    });
  }
}
