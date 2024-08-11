import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs';



const apiUrl = 'https://movieflix-87lf.onrender.com';

@Injectable({
  providedIn: 'root'
})
export class FetchApiDataService {
  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });
  }

  private getToken(): string {
    return localStorage.getItem('token') || '';
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.error instanceof ErrorEvent) {
      console.error('Client-side error:', error.error.message);
    } else {
      console.error(`Server-side error: Status code ${error.status}, Error body is: ${error.message}`);
      console.error('Full error response:', error);
    }
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }

  // User registration
  public userRegistration(userDetails: any): Observable<any> {
    return this.http.post(`${apiUrl}/users`, userDetails, { headers: this.getHeaders() }).pipe(
      tap((response: any) => console.log('API Response:', response)),
      catchError(this.handleError)
    );
  }

  public userLogin(userDetails: any): Observable<any> {
    return this.http.post(`${apiUrl}/login`, userDetails, { headers: new HttpHeaders({'Content-Type': 'application/json'}) }).pipe(
      tap((response: any) => {
        // Save token and user details to localStorage
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user)); // Store user details
      }),
      catchError(this.handleError)
    );
  }
  

  public getAllMovies(): Observable<any> {
    return this.http.get(`${apiUrl}/movies`, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  public getOneMovie(title: string): Observable<any> {
    return this.http.get(`${apiUrl}/movies/${title}`, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  public getDirector(name: string): Observable<any> {
    return this.http.get(`${apiUrl}/directors/${name}`, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  public getGenre(name: string): Observable<any> {
    return this.http.get(`${apiUrl}/genres/${name}`, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  public getUser(username: string): Observable<any> {
    return this.http.get(`${apiUrl}/users/${username}`, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  public getUserByID(id: string): Observable<any> {
    return this.http.get(`${apiUrl}/users/${id}`, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  public getFavoriteMovies(username: string): Observable<any> {
    return this.http.get(`${apiUrl}/users/${username}/movies`, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  public addFavoriteMovie(movieId: string): Observable<any> {
    const username = this.getUsername();
    return this.http.post(`${apiUrl}/users/${username}/movies/${movieId}`, {}, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  public deleteFavoriteMovie(movieId: string): Observable<any> {
    const username = this.getUsername();
    return this.http.delete(`${apiUrl}/users/${username}/movies/${movieId}`, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  public editUser(username: string, userDetails: any): Observable<any> {
    return this.http.put(`${apiUrl}/users/${username}`, userDetails, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  public deleteUser(username: string): Observable<any> {
    return this.http.delete(`${apiUrl}/users/${username}`, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  private getUsername(): string {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.username || '';
  }
}
