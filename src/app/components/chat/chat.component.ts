import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { ActivatedRoute, Router } from '@angular/router';

export interface IMessage {
  text: string;
  from: string;
  date: Date;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  channelId: string;
  messages: IMessage[] = [];
  msg: any;

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private db: AngularFireDatabase) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(param => this.channelId = param.get('id'));
    this.db.list<IMessage>(`channels/${this.channelId}/messages`).valueChanges().subscribe(data => this.messages = data);
  }

  send() {
    if (this.msg) {
      this.db.list(`channels/${this.channelId}/messages`)
        .push({ from: localStorage.getItem('uid'), text: this.msg, date: new Date().toLocaleTimeString() });
      this.msg = '';
    }
  }
}
