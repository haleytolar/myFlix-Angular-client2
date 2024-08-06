import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatButtonModule]
})
export class NavigationComponent {
  constructor(private router: Router) {}

  logout(): void {
    localStorage.removeItem('user');
    this.router.navigate(['/welcome']);
  }
}
