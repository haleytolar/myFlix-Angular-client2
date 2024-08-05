import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

const apiUrl = 'https://movieflix-87lf.onrender.com';

@Injectable({
  providedIn: 'root'
})
export class FetchApiDataService {
  constructor(private http: HttpClient) {}

  public userRegistration(userDetails: any): Observable<any> {
    return this.http.post(`${apiUrl}/users`, userDetails).pipe(
      tap((response: any) => console.log('API Response:', response)), // Log the response
      catchError(this.handleError)
    );
  }
  

  public userLogin(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http.post(apiUrl + '/login', userDetails).pipe(
      tap((response: any) => console.log('API Response:', response)),
      catchError(this.handleError)
    );
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

  private getToken(): string {
    return localStorage.getItem('token') || '';
  }

  public getAllMovies(): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${apiUrl}/movies`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  public getOneMovie(title: string): Observable<any> {
    return this.http.get(`${apiUrl}/movies/${title}`).pipe(
      catchError(this.handleError)
    );
  }

  public getDirector(name: string): Observable<any> {
    return this.http.get(`${apiUrl}/directors/${name}`).pipe(
      catchError(this.handleError)
    );
  }

  public getGenre(name: string): Observable<any> {
    return this.http.get(`${apiUrl}/genres/${name}`).pipe(
      catchError(this.handleError)
    );
  }

  public getUser(username: string): Observable<any> {
    return this.http.get(`${apiUrl}/users/${username}`).pipe(
      catchError(this.handleError)
    );
  }

  public getFavoriteMovies(username: string): Observable<any> {
    return this.http.get(`${apiUrl}/users/${username}/movies`).pipe(
      catchError(this.handleError)
    );
  }

  public addFavoriteMovie(username: string, movieId: string): Observable<any> {
    return this.http.post(`${apiUrl}/users/${username}/movies/${movieId}`, {}).pipe(
      catchError(this.handleError)
    );
  }

  public editUser(username: string, userDetails: any): Observable<any> {
    return this.http.put(`${apiUrl}/users/${username}`, userDetails).pipe(
      catchError(this.handleError)
    );
  }

  public deleteUser(username: string): Observable<any> {
    return this.http.delete(`${apiUrl}/users/${username}`).pipe(
      catchError(this.handleError)
    );
  }

  public deleteFavoriteMovie(username: string, movieId: string): Observable<any> {
    return this.http.delete(`${apiUrl}/users/${username}/movies/${movieId}`).pipe(
      catchError(this.handleError)
    );
  }
}
