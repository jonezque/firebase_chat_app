import { Component } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  name: string;
  age: string;

  constructor(private router: Router, private db: AngularFireDatabase) { }

  async update() {
    const path = `users/${localStorage.getItem('uid')}`;
    await this.db.object(path).set({ name: this.name, age: this.age });
    this.router.navigate(['list']);
  }
}
