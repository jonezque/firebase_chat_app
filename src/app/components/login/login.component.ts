import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email: string;
  password: string;

  constructor(private auth: AngularFireAuth, private router: Router) { }

  async login() {
    await this.auth.auth.signOut();
    await this.auth.auth.signInWithEmailAndPassword(this.email, this.password);
    this.router.navigate(['/list']);
  }

  async create() {
    await this.auth.auth.signOut();
    await this.auth.auth.createUserWithEmailAndPassword(this.email, this.password);
    this.router.navigate(['/list']);
  }
}
