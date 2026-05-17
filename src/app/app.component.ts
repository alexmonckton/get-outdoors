import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from './core/services/cart.service';
import { AlertComponent } from './core/components/alert/alert.component';
import { DialogComponent } from './core/components/dialog/dialog.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, AlertComponent, DialogComponent],
  templateUrl: 'app.component.html',
  styleUrl: 'app.component.scss',
})
export class AppComponent {
  readonly cartService = inject(CartService);
}
