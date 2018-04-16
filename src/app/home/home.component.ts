import { Component, OnInit } from '@angular/core';

declare let $: any

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

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

}
