import { Component, Input, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-login-form',
  standalone: true,
  templateUrl: './user-login-form.component.html',
  styleUrls: ['./user-login-form.component.scss'],
  imports: [
    CommonModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    FormsModule
  ]
})
export class UserLoginFormComponent implements OnInit {
  @Input() userData = {
    Username: '',
    Password: '',
  };

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserLoginFormComponent>,
    public snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {}

  loginUser(): void {
    this.fetchApiData.userLogin(this.userData).subscribe({
      next: (result) => {
        console.log('Login result:', result); // Debugging line to check the structure of the result object
        if (result && result.user) {
          localStorage.setItem('user', JSON.stringify(result.user));
          localStorage.setItem('token', result.token);
          this.dialogRef.close();
          this.snackBar.open(`Welcome ${result.user.Username}`, 'OK', { // Assuming `Username` is the correct property
            duration: 2000
          });
          this.router.navigate(['movies']);
        } else {
          this.snackBar.open('User login failed: User data missing', 'OK', {
            duration: 2000
          });
        }
      },
      error: (error) => {
        console.log('Login error:', error); // Debugging line to log the error
        this.snackBar.open('User login failed', 'OK', {
          duration: 2000
        });
      }
    });
  }}
  
  