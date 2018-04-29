import { Component, OnInit, trigger, state, style, transition, animate  } from '@angular/core';
import * as firebase from 'firebase';
import { AngularFireDatabase , AngularFireList } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-monitoramento',
  templateUrl: './monitoramento.component.html',
  styleUrls: ['./monitoramento.component.css'],
  animations: [
    trigger('listItems', [
      state('escondido', style({
        opacity: 0,
        'z-index': '-1'
      })),
      state('visivel', style({
        opacity: 1,
        'z-index': '0'
      })),
      transition('escondido <=> visivel', animate('1.5s ease-in')),
    ]),
  ]
})
export class MonitoramentoComponent implements OnInit {

  public stateListItems: string = 'escondido'

  public items: AngularFireList<any>;
  public cartoes: Observable<any[]>;

  public sharedFacebook: number
  public sharedWhatsApp: number
  public sharedCopyLink: number
  public totalItems: number
  
  constructor(db: AngularFireDatabase) {
    this.items = db.list('cartao');
    // Use snapshotChanges().map() to store the key
    this.cartoes = this.items.snapshotChanges().map(changes => {
      return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    });

    this.cartoes.subscribe(resultItems=>{
      
      this.totalItems = resultItems.length

      let sharedFacebook = resultItems.filter( obj => {
        return obj.shareFacebook== true;
      });
      let sharedWhatsApp = resultItems.filter( obj => {
        return obj.shareWhatsApp == true;
      });
      let sharedCopyLink= resultItems.filter( obj => {
        return obj.shareCopyLink == true;
      });

      this.sharedWhatsApp = sharedWhatsApp.length
      this.sharedFacebook = sharedFacebook.length
      this.sharedCopyLink = sharedCopyLink.length
      this.stateListItems = 'visivel'
    })
    
  }

  ngOnInit() {
  }

  deleteItem(key: string) {    
    this.items.remove(key); 
  }

}
