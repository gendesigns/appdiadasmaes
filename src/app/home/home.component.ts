import { Component, OnInit, trigger, state, style, transition, animate } from '@angular/core';
import { FacebookService, InitParams, UIParams, UIResponse } from 'ngx-facebook';

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

  public estadoHome: string = 'visivel'
  public estadoCartao: string = 'escondido'

  constructor(private fb: FacebookService) { 
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
    this.estadoHome = this.estadoHome === 'visivel' ? 'escondido' : 'visivel'
    this.estadoCartao = this.estadoCartao === 'visivel' ? 'escondido' : 'visivel'
  }

  public shareFb() {
    
    let params: UIParams = {
      href: "",
      method: 'share'
    };

    this.fb.ui(params)
      .then((res: UIResponse) => {})
      .catch((e: any) => {});
  }

}
