import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';

  constructor(private router: Router) {}

  onLogin() {
    if (this.email === 'admin' && this.password === 'admin') {
      this.router.navigate(['/dashboard']);
    } else {
      this.errorMessage = 'E-mail ou senha inválidos';
    }
  }
}
