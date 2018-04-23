import { Component } from '@angular/core';
import { FacebookService, InitParams } from 'ngx-facebook';
import * as firebase from 'firebase';
import { FirebaseConfig } from '../environments/firebase.config';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'app';

  ngOnInit() {

    firebase.initializeApp(FirebaseConfig);
    
  }
}
