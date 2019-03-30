import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';



export interface IUser {
  id: string;
  age: number;
  name: string;
}

export interface IChannel {
  users: string[];
}

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss']
})
export class ChatListComponent implements OnInit, OnDestroy {
  uid = localStorage.getItem('uid');
  users: IUser[];
  subscription: Subscription;

  constructor(private router: Router, private db: AngularFirestore) {}

  ngOnInit() {
    this.subscription = this.db.collection<IUser>('users').snapshotChanges()
      .subscribe(data => this.users = data
        .filter(user => user.payload.doc.id !== this.uid)
        .map(user => ({ id: user.payload.doc.id, ...user.payload.doc.data() })));
  }

  goToChat(id: string) {
    this.db.collection<IChannel>('channels', ref => ref.where('users', 'array-contains', this.uid))
      .get().subscribe(async (data) => {
        const channel = data.docs.filter(chat => chat.data().users.includes(id));
        if (channel.length) {
          this.router.navigate([ `/chat/${channel[0].id}` ]);
        } else {
          const chat = await this.db.collection<IChannel>('channels').add({ users: [id, this.uid] });
          this.router.navigate([ `/chat/${chat.id}` ]);
        }
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  track(_: number, user: IUser) {
    return user.id;
  }
}
