import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

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
    FormsModule,
    MatIconModule,
    MatSnackBarModule
  ]
})
export class UserProfileComponent implements OnInit {
  userData: any = {};
  favoriteMovies: any[] = [];

  constructor(
    private fetchApiData: FetchApiDataService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadUserData();
    this.getFavoriteMovies();
  }

  loadUserData(): void {
    const storedUserData = localStorage.getItem('user');
    if (storedUserData) {
      this.userData = JSON.parse(storedUserData);
    } else {
      console.error('User data not found in localStorage.');
      this.router.navigate(['/welcome']);
    }
  }

  getFavoriteMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.favoriteMovies = resp.filter((movie: any) =>
        this.userData.FavoriteMovies?.includes(movie._id)
      ).map((movie: any) => ({
        ...movie,
        isFavorite: true // Since these are all favorites
      }));
    }, (error: any) => {
      console.error('Failed to load favorite movies:', error);
    });
  }
  
  

  modifyFavoriteMovies(movie: any): void {
    if (!this.userData.Username) {
      console.error('User not logged in or missing username.');
      this.snackBar.open('Failed to update favorites: User not logged in.', 'OK', { duration: 2000 });
      return;
    }

    const userId = this.userData.Username;

    if (this.userData.FavoriteMovies && this.userData.FavoriteMovies.includes(movie._id)) {
      this.fetchApiData.deleteFavoriteMovie(userId, movie._id).subscribe({
        next: () => {
          movie.isFavorite = false;
          this.userData.FavoriteMovies = this.userData.FavoriteMovies.filter((id: string) => id !== movie._id);
          localStorage.setItem("user", JSON.stringify(this.userData));
          this.snackBar.open('Removed from favorites', 'OK', { duration: 2000 });

          console.log('Removed from favorites:', movie);

          this.getFavoriteMovies();
        },
        error: (err: any) => {
          console.error('Failed to remove from favorites:', err);
          this.snackBar.open('Failed to remove from favorites', 'OK', { duration: 2000 });
        }
      });
    } else {
      this.fetchApiData.addFavoriteMovie(userId, movie._id).subscribe({
        next: () => {
          movie.isFavorite = true;
          if (this.userData.FavoriteMovies) {
            this.userData.FavoriteMovies.push(movie._id);
          } else {
            this.userData.FavoriteMovies = [movie._id];
          }
          localStorage.setItem("user", JSON.stringify(this.userData));
          this.snackBar.open('Added to favorites', 'OK', { duration: 2000 });

          console.log('Added to favorites:', movie);

          this.getFavoriteMovies();
        },
        error: (err: any) => {
          console.error('Failed to add to favorites:', err);
          this.snackBar.open('Failed to add to favorites', 'OK', { duration: 2000 });
        }
      });
    }
  }

  editUser(): void {
    const originalUsername = JSON.parse(localStorage.getItem('user') || '{}').Username;
  
    this.fetchApiData.editUser(originalUsername, this.userData).subscribe({
      next: (updatedUser: any) => {
        localStorage.setItem('user', JSON.stringify(updatedUser));
        this.router.navigate(['/movies']);
      },
      error: (err: any) => {
        console.error('Failed to update user:', err);
      }
    });
  }
  
  updateUser(): void {
    this.editUser();
  }  
  
}