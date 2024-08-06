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

  constructor(
    public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getMovies();
  }

  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      return this.movies;
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
    movie.isFavorite = !movie.isFavorite; // Toggle favorite status for simplicity
    this.snackBar.open(
      movie.isFavorite ? 'Added to favorites' : 'Removed from favorites',
      'OK',
      { duration: 2000 }
    );
  }
}
