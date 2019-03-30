import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  name: string;
  age: string;

  constructor(private router: Router, private db: AngularFirestore) { }

  async update() {
    await this.db.collection('users')
      .doc(localStorage.getItem('uid'))
      .set({ name: this.name, age: this.age });
    this.router.navigate(['list']);
  }
}
