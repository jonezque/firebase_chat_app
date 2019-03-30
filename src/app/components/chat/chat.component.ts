import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

export interface IMessage {
  text: string;
  from: string;
  date: number;
  id?: string;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {
  channelId: string;
  messages: IMessage[] = [];
  msg: string;
  subscription: Subscription;

  constructor(private activatedRoute: ActivatedRoute, private db: AngularFirestore) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(param => this.channelId = param.get('id'));
    this.subscription = this.db.collection<IMessage>(`channels/${this.channelId}/messages`, ref => ref.orderBy('date'))
      .stateChanges([ 'added' ])
      .subscribe(data => this.messages = [ ...this.messages,
        ...data.map(msg => ({ ...msg.payload.doc.data(), id: msg.payload.doc.id })) ]);
  }

  send() {
    if (this.msg) {
      this.db.collection<IMessage>(`channels/${this.channelId}/messages`)
        .add({ from: localStorage.getItem('uid'),
               text: this.msg,
               date: new Date().getTime() });
      this.msg = '';
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  track(_: number, msg: IMessage) {
    return msg.id;
  }
}
