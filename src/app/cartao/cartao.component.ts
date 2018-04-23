import { Component, OnInit, Input } from '@angular/core';
import * as html2canvas from "html2canvas";
import { Cartao } from './cartao.model';

import 'firebase/storage';
import * as firebase from 'firebase'
import { Observable } from 'rxjs/Rx'

import { FacebookService, InitParams, UIParams, UIResponse } from 'ngx-facebook';


declare let $: any

@Component({
  selector: 'app-cartao',
  templateUrl: './cartao.component.html',
  styleUrls: ['./cartao.component.css'],
})
export class CartaoComponent implements OnInit {

  public frases = [
    `O amor de mãe não cabe no infinito, é a mais completa forma de amor.<br>
    Mãe, você é o maior presente que a vida me deu.<br>  
    <b>Feliz Dia das Mães!</b>
    `,

    `Você é a minha guerreira, me deu a vida e me ensinou a lutar por ela.<br>
    Obrigada por estar presente em todos os momentos dos meus dias.<br> 
    <b>Feliz Dia das Mães!</b>`,

    `O seu dia é hoje, mas pode ser comemorado diariamente, afinal em todos os momentos especiais da minha vida você está presente.<br> 
    <b>Feliz Dia das Mães!</b>
    `
  ];
  public cartoes = ['cartao1', 'cartao2', 'cartao3', 'cartao4', 'cartao5'];

  public uploadPercent: Observable<number>;
  public downloadURL: Observable<string>;

  public frase;
  public cartao;
  public de;
  public para;
  public image;
  public createdAt;

  public titleLoader: string;
  public txtLoader: string;

  @Input() deInput
  @Input() paraInput

  constructor(private fb: FacebookService) {
    let initParams: InitParams = {
      appId: '315302218998864',
      xfbml: true,
      version: 'v2.12'
    };

    fb.init(initParams);

  }

  ngOnInit() {

    // this.titleLoader = 'Aguarde!'
    // this.txtLoader = 'Estamos preparando o link para Compartilhar.'

    this.createdAt = new Date()

    function doOnOrientationChange() {
      if (('ontouchstart' in document.documentElement)) {
        if (screen.height < screen.width) {
          $('section').addClass('landscape');
        } else if (('ontouchstart' in document.documentElement)) {
          $('section').removeClass('landscape');
        }
      }
    }
    window.addEventListener('orientationchange', doOnOrientationChange);
    doOnOrientationChange();

    this.gerarCartao();
  }

  trocarCartao() {
    var numeroBgCartao = $("input[name=img]:checked").val();
    if (numeroBgCartao) {
      var cartaoEscolhido = this.cartoes[numeroBgCartao];
      this.cartao = cartaoEscolhido;
    }
    $('#trocar-bg').modal('hide');
  }
  trocarFrase() {
    var numeroFrase = $("input[name=frase]:checked").val();
    if (numeroFrase) {
      var fraseEscolhida = this.frases[numeroFrase];
      this.frase = fraseEscolhida;
    }
    $('#trocar-frase').modal('hide');
  }
  gerarCartao() {
    var numeroFrase = Math.random();
    numeroFrase = Math.floor(numeroFrase * 3);

    var numeroBgCartao = Math.random();
    numeroBgCartao = Math.floor(numeroBgCartao * 5);

    var fraseEscolhida = this.frases[numeroFrase];
    var cartaoEscolhido = this.cartoes[numeroBgCartao];
    this.frase = fraseEscolhida;
    this.cartao = cartaoEscolhido;
  }

  enviarCartao() {

    $('#trocar-bg-btn').remove();
    $('#trocar-frase-btn').remove();
    $('.bg-loader').css('display', 'block');

    this.titleLoader = 'Aguarde!'
    this.txtLoader = 'Estamos preparando o link para Compartilhar.'

    html2canvas(document.querySelector('#cartao'))
      .then((canvas) => {

        canvas.toBlob(blob => {
          let rash = $('#de').val() + $('#para').val() + Date.now()
          let de = $('#de').val()
          let para = $('#para').val()
          let createdAt = Date.now()

          const storageRef = firebase.storage().ref();
          const uploadTask = storageRef.child(`cartao/${btoa(rash)}`).put(blob);

          uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
            (snapshot: firebase.storage.UploadTaskSnapshot) => {
              // upload in progress
              const snap = snapshot;
              let progress = (snap.bytesTransferred / snap.totalBytes) * 100
              console.log('Progresso: ', progress)
            },
            (error) => {
              // upload failed
              console.log(error);
            },
            () => {
              // upload success

              if (uploadTask.snapshot.downloadURL) {
                let url = uploadTask.snapshot.downloadURL;
                firebase.database().ref(`cartao/${btoa(rash)}`)
                  .set({ de: de, para: para, imageUrl: url, shared: false, createdAt: createdAt })

                this.shared(rash, url)

                return;
              } else {
                console.error('No download URL!');
              }
            },
          );
        }, 'image/jpeg', 0.95)

      })
      .catch(err => {
        // console.log("error canvas", err);
      });
  }


  public shared(rash: any, url: string): void {
    
    let params: UIParams = {
      href: url,
      message: 'Dia das Mães Rommanel',
      method: 'share'
    };

    this.fb.ui(params)
      .then((res: UIResponse) => {
        firebase.database().ref(`cartao/${btoa(rash)}`)
          .update({ shared: true })
        this.titleLoader = 'Seu cartão foi compartilhado! :)'
        $('.btn-loader').css('display', 'block');
        this.txtLoader = ''
      })
      .catch((e: any) => {
        $('#btns-func').append('<button class="btn push-left btn-primary" data-toggle="modal" data-target="#trocar-bg" id="trocar-bg-btn">Trocar Imagem</button><button class="btn push-right btn-primary" data-toggle="modal" data-target="#trocar-frase" id="trocar-frase-btn">Trocar frase</button>');
        $('.bg-loader').css('display', 'none');
      });
  }


}
