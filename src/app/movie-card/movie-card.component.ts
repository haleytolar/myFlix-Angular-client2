import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class MovieCardComponent implements OnInit {
  movies: any[] = [];
  user: any = {};

  constructor(
    private fetchApiData: FetchApiDataService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem("user") || '{}');
    this.getMovies();
  }

  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp.map((movie: any) => ({
        ...movie,
        isFavorite: this.user.favoriteMovies?.includes(movie._id)
      }));
    });
  }

  showGenre(genreName: string): void {
    this.snackBar.open(`Genre: ${genreName}`, 'OK', { duration: 2000 });
  }

  showDirector(directorName: string): void {
    this.snackBar.open(`Director: ${directorName}`, 'OK', { duration: 2000 });
  }

  showDetail(movie: any): void {
    this.snackBar.open(`Synopsis: ${movie.Description}`, 'OK', { duration: 4000 });
  }

  modifyFavoriteMovies(movie: any): void {
    this.user = JSON.parse(localStorage.getItem("user") || '{}');
  
    if (!this.user.username) {
      console.error('User not logged in or missing username.');
      this.snackBar.open('Failed to update favorites: User not logged in.', 'OK', { duration: 2000 });
      return;
    }
  
    const icon = document.getElementById(`${movie._id}-favorite-icon`);
  
    if (this.user.favoriteMovies && this.user.favoriteMovies.includes(movie._id)) {
      this.fetchApiData.deleteFavoriteMovie(movie._id).subscribe({
        next: () => {
          icon?.setAttribute("fontIcon", "favorite_border");
          this.user.favoriteMovies = this.user.favoriteMovies.filter((id: string) => id !== movie._id);
          localStorage.setItem("user", JSON.stringify(this.user));
          this.snackBar.open('Removed from favorites', 'OK', { duration: 2000 });
        },
        error: (err: any) => {
          console.error(err);
          this.snackBar.open('Failed to remove from favorites', 'OK', { duration: 2000 });
        }
      });
    } else {
      this.fetchApiData.addFavoriteMovie(movie._id).subscribe({
        next: () => {
          icon?.setAttribute("fontIcon", "favorite");
          if (this.user.favoriteMovies) {
            this.user.favoriteMovies.push(movie._id);
          } else {
            this.user.favoriteMovies = [movie._id];
          }
          localStorage.setItem("user", JSON.stringify(this.user));
          this.snackBar.open('Added to favorites', 'OK', { duration: 2000 });
        },
        error: (err: any) => {
          console.error(err);
          this.snackBar.open('Failed to add to favorites', 'OK', { duration: 2000 });
        }
      });
    }
  }
}