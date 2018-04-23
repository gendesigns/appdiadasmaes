import { Component, OnInit, trigger, state, style, transition, animate } from '@angular/core';

declare let $: any

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [
    trigger('home', [
      state('escondido', style({
        opacity: 0,
        'z-index': '-1'
      })),
      state('visivel', style({
        opacity: 1,
        'z-index': '0'
      })),
      transition('escondido <=> visivel', animate('1s ease-in')),
    ]),
    trigger('cartao', [
      state('escondido', style({
        opacity: 0
      })),
      state('visivel', style({
        opacity: 1
      })),
      transition('escondido <=> visivel', animate('1s ease-in')),
    ])
  ]
})
export class HomeComponent implements OnInit {

  public path_image = 'assets/imgs/bg-cartao-1.jpg'

  public estadoHome: string = 'visivel'
  public estadoCartao: string = 'escondido'

  constructor() { }

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
    // this.estado = 'visivel'
    this.estadoHome = this.estadoHome === 'visivel' ? 'escondido' : 'visivel'
    this.estadoCartao = this.estadoCartao === 'visivel' ? 'escondido' : 'visivel'
  }

}
