import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import{ Navbar} from '../app/navbar/navbar';
import { HomePage } from './home-page/home-page';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, RouterLinkActive, RouterLink, HomePage],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Banking');
}
