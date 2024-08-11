import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FetchApiDataService } from '../fetch-api-data.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule
  ]
})
export class UserProfileComponent implements OnInit {
  userData: any = {};
  favoriteMovies: any[] = [];

  constructor(
    private fetchApiData: FetchApiDataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userData = JSON.parse(localStorage.getItem('user') || '{}');
    this.getFavoriteMovies();
  }

  getFavoriteMovies(): void {
    this.fetchApiData.getFavoriteMovies(this.userData.username).subscribe((resp: any) => {
      this.favoriteMovies = resp;
    });
  }

  deleteAccount(): void {
    this.fetchApiData.deleteUser(this.userData.username).subscribe({
      next: () => {
        localStorage.clear();
        this.router.navigate(['/welcome']);
      },
      error: (err: any) => {
        console.error(err);
      }
    });
  }

  editUser(): void {
    this.fetchApiData.editUser(this.userData.username, this.userData).subscribe((updatedUser: any) => {
      localStorage.setItem('user', JSON.stringify(updatedUser));
      this.router.navigate(['/movies']);
    });
  }

  // Add this method if it is indeed needed
  updateUser(): void {
    // Implementation of updateUser
    console.log('Update user method called');
  }
}
