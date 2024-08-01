import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

// Declaring the API URL that will provide data for the client app
const apiUrl = 'https://mflixxx.netlify.app';

@Injectable({
  providedIn: 'root'
})
export class UserRegistrationService {
  // Inject the HttpClient module to the constructor params
  // This will provide HttpClient to the entire class, making it available via this.http
  constructor(private http: HttpClient) { }

  // Making the API call for the user registration endpoint
  public userRegistration(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http.post(`${apiUrl}/users`, userDetails).pipe(
      catchError(this.handleError) // Updated error handling
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.error instanceof ErrorEvent) {
      console.error('Some error occurred:', error.error.message);
    } else {
      console.error(
        `Error Status code ${error.status}, ` +
        `Error body is: ${error.error}`
      );
    }
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }

  // Get token from local storage
  private getToken(): string {
    return localStorage.getItem('token') || '';
  }

  // Get all movies
  public getAllMovies(): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http
      .get(`${apiUrl}/movies`, { headers })
      .pipe(catchError(this.handleError));
  }

  // Get one movie
  public getOneMovie(title: string): Observable<any> {
    return this.http
      .get(`${apiUrl}/movies/${title}`)
      .pipe(catchError(this.handleError));
  }

  // Get director
  public getDirector(name: string): Observable<any> {
    return this.http
      .get(`${apiUrl}/directors/${name}`)
      .pipe(catchError(this.handleError));
  }

  // Get genre
  public getGenre(name: string): Observable<any> {
    return this.http
      .get(`${apiUrl}/genres/${name}`)
      .pipe(catchError(this.handleError));
  }

  // Get user
  public getUser(username: string): Observable<any> {
    return this.http
      .get(`${apiUrl}/users/${username}`)
      .pipe(catchError(this.handleError));
  }

  // Get favorite movies for a user
  public getFavoriteMovies(username: string): Observable<any> {
    return this.http
      .get(`${apiUrl}/users/${username}/movies`)
      .pipe(catchError(this.handleError));
  }

  // Add a movie to favorite movies
  public addFavoriteMovie(username: string, movieId: string): Observable<any> {
    return this.http
      .post(`${apiUrl}/users/${username}/movies/${movieId}`, {})
      .pipe(catchError(this.handleError));
  }

  // Edit user
  public editUser(username: string, userDetails: any): Observable<any> {
    return this.http
      .put(`${apiUrl}/users/${username}`, userDetails)
      .pipe(catchError(this.handleError));
  }

  // Delete user
  public deleteUser(username: string): Observable<any> {
    return this.http
      .delete(`${apiUrl}/users/${username}`)
      .pipe(catchError(this.handleError));
  }

  // Delete a movie from favorite movies
  public deleteFavoriteMovie(username: string, movieId: string): Observable<any> {
    return this.http
      .delete(`${apiUrl}/users/${username}/movies/${movieId}`)
      .pipe(catchError(this.handleError));
  }
}