import { Routes } from '@angular/router';
import { Deposito } from '../app/deposito/deposito';
import { Saldo } from '../app/saldo/saldo';
import { Movimenti } from '../app/movimenti/movimenti';
import { Conversione } from '../app/conversione/conversione';
import { Prelievi } from '../app/prelievi/prelievi';
import { Conto } from '../app/conto/conto';
import { HomePage } from '../app/home-page/home-page';

export const routes: Routes = [
  { path: '', component: HomePage },
  { path: 'depositi', component: Deposito, },
  { path: 'saldo', component: Saldo, },
  { path: 'movimenti', component: Movimenti, },
  { path: 'conversione', component: Conversione, },
  { path: 'prelievi', component: Prelievi, },
  { path: 'conto', component: Conto, },
];
