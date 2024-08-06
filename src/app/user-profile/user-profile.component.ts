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
    public fetchApiData: FetchApiDataService,
    private router: Router 
  ) {
    this.userData = JSON.parse(localStorage.getItem("user") || "{}");
  }

  ngOnInit(): void {
    this.getUser();
  }

  updateUser(): void {
    this.fetchApiData.editUser(this.userData.username, this.userData).subscribe({
      next: (res: any) => {
        this.userData = {
          ...res,
          id: res._id,
          password: this.userData.password,
          token: this.userData.token
        };
        localStorage.setItem("user", JSON.stringify(this.userData));
        this.getFavoriteMovies();
      },
      error: (err: any) => {
        console.error(err);
      }
    });
  }

  resetUser(): void {
    this.userData = JSON.parse(localStorage.getItem("user") || "{}");
  }

  backToMovie(): void {
    this.router.navigate(["movies"]);
  }

  getFavoriteMovies(): void {
    this.fetchApiData.getFavoriteMovies(this.userData.username).subscribe({
      next: (res: any) => {
        this.favoriteMovies = res.filter((movie: any) => {
          return this.userData.favoriteMovies.includes(movie._id);
        });
      },
      error: (err: any) => {
        console.error(err);
      }
    });
  }

  getUser(): void {
    this.fetchApiData.getUserByID(this.userData.id).subscribe({
      next: (res: any) => {
        this.userData = {
          ...res,
          id: res._id,
          password: this.userData.password,
          token: this.userData.token
        };
        localStorage.setItem("user", JSON.stringify(this.userData));
        this.getFavoriteMovies();
      },
      error: (err: any) => {
        console.error(err);
      }
    });
  }

  removeFromFavorite(movie: any): void {
    this.fetchApiData.deleteFavoriteMovie(this.userData.username, movie._id).subscribe({
      next: (res: any) => {
        this.userData.favoriteMovies = res.favoriteMovies;
        this.getFavoriteMovies();
      },
      error: (err: any) => {
        console.error(err);
      }
    });
  }
  
  logout(): void {
    this.router.navigate(["welcome"]);
    localStorage.removeItem("user");
  }
}
