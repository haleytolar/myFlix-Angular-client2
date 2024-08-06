import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavigationComponent } from './navigation/navigation.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [RouterModule, CommonModule, NavigationComponent]
})
export class AppComponent {
  title = 'myFlix-Angular-client';

  constructor(public router: Router) {}
}
