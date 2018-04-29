import { Component, OnInit, trigger, state, style, transition, animate } from '@angular/core';
import { FacebookService, InitParams, UIParams, UIResponse } from 'ngx-facebook';
import * as firebase from 'firebase';
import { AngularFireDatabase , AngularFireList } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';

declare let $: any

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [
    trigger('home', [
      state('escondido', style({
        opacity: 0,
        display:'none',
        'z-index': '-1'
      })),
      state('visivel', style({
        opacity: 1,
        display:'flex',
        'z-index': '0'
      })),
      transition('escondido <=> visivel', animate('1s ease-in')),
    ]),
    trigger('cartao', [
      state('escondido', style({
        opacity: 0,
        display:'none'
      })),
      state('visivel', style({
        opacity: 1,
        display:'block'
      })),
      transition('escondido <=> visivel', animate('1s ease-in')),
    ])
  ]
})
export class HomeComponent implements OnInit {

  public items: AngularFireList<any>;
  public cartoes: Observable<any[]>;

  public estadoHome: string = 'visivel'
  public estadoCartao: string = 'escondido'

  public countShared:number = 0;

  constructor(private fb: FacebookService, private db: AngularFireDatabase) { 
    
    this.items = db.list('videoHome');

    let initParams: InitParams = {
      appId: '315302218998864',
      xfbml: true,
      version: 'v2.12'
    };
    fb.init(initParams);
  }

  ngOnInit() {
    function doOnOrientationChange() {
      if (('ontouchstart' in document.documentElement)) {
        if (screen.height < screen.width) {
          $('.home').addClass('landscape');
        } else if (('ontouchstart' in document.documentElement)) {
          $('.home').removeClass('landscape');
        }
      }
    }
    window.addEventListener('orientationchange', doOnOrientationChange);
    doOnOrientationChange();
  }

  mostrarCartao() {
    $(document).scrollTop(0);
    // this.estado = 'visivel'
    let de =  $("#de").val();
    let para =  $("#para").val();
    if(de===''&& para===''){
      $('.bg-loader').css('display', 'block');
    }else{
      this.estadoHome = this.estadoHome === 'visivel' ? 'escondido' : 'visivel'
      this.estadoCartao = this.estadoCartao === 'visivel' ? 'escondido' : 'visivel'
    }
    
  }

  public voltar(){
    $('.bg-loader').css('display', 'none');
  }

  public shareFb() {
    let params: UIParams = {
      href: "https://youtu.be/c1AF1YJTDxI",
      method: 'share'
    };

    this.fb.ui(params)
      .then((res: UIResponse) => {
        this.countShared += 1;
        this.items.update('sharedFacebook',{shared: this.countShared}) 
      })
      .catch((e: any) => {});
  }

}
