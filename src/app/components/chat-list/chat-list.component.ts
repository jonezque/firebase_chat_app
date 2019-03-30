import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Router } from '@angular/router';

export interface IUser {
  key: string;
  age: number;
  name: string;
}

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss']
})
export class ChatListComponent implements OnInit {
  uid = localStorage.getItem('uid');
  users: IUser[];

  constructor(private db: AngularFireDatabase, private router: Router) {}

  ngOnInit() {
    this.db.list<IUser>('users').snapshotChanges()
      .subscribe(data => this.users = data.map(val => ({...val.payload.val(), key: val.key}))
      .filter(val => val.key !== this.uid));
    if (!this.uid) {
      this.router.navigate(['login']);
    }
  }

  goToChat(key: string) {
    console.log(this.uid, key);
    if (this.uid !== key) {
      this.db.list<any>('channels').snapshotChanges().subscribe(chats => {
        chats = chats.filter(chat => {
          const users = chat.payload.val().users as string[];
          if (users.includes(key) && users.includes(this.uid)) {
            return true;
          }
          return false;
        });
        if (chats.length) {
              this.router.navigate([`/chat/${chats[0].key}`]);
        } else {
          this.db.list<any>('channels').push({ users: [this.uid, key]})
            .then(chat => {
              this.router.navigate([`/chat/${chat.key}`]);
            });
        }
      });
    }
  }
}
