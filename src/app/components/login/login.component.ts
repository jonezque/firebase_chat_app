import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  email: string;
  password: string;

  constructor(private auth: AngularFireAuth, private router: Router) { }

  ngOnInit() {
    this.auth.authState.subscribe(user => localStorage.setItem('uid', user && user.uid));
  }

  async login() {
    await this.auth.auth.signOut();
    await this.auth.auth.signInWithEmailAndPassword(this.email, this.password);
    this.router.navigate(['/list']);
  }

  async create() {
    await this.auth.auth.signOut();
    await this.auth.auth.createUserWithEmailAndPassword(this.email, this.password);
    this.router.navigate(['/profile']);
  }
}
