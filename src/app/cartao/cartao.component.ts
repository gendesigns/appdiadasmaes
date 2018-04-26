import { Component, OnInit, Input, trigger, state, style, transition, animate } from '@angular/core';
import * as html2canvas from "html2canvas";

import 'firebase/storage';
import * as firebase from 'firebase'
import { Observable } from 'rxjs/Rx'

import { FacebookService, InitParams, UIParams, UIResponse } from 'ngx-facebook';

import { FileUploadModule } from 'primeng/fileupload';
import {Message} from 'primeng/components/common/api';


declare let $: any

@Component({
  selector: 'app-cartao',
  templateUrl: './cartao.component.html',
  styleUrls: ['./cartao.component.css'],
  animations: [
    trigger('shareLinks', [
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
  ]
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

  public stateShareLinks: string = 'escondido'

  public frase;
  public cartao;
  public de;
  public para;
  public image;
  public createdAt;

  public titleLoader: string;
  public txtLoader: string;
  public hash: string
  public url: string
  public shortUrl: string
  public whatsAppUrl: string

  public imagepload: any

  public msgs: Message[];
  public uploadedFiles: any[] = [];

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

    this.titleLoader = 'Aguarde...'
    this.txtLoader = 'O seu cartão está sendo criado com carinho.'
    
    html2canvas(document.querySelector('#cartao'))
      .then((canvas) => {
        this.imagepload = canvas.toDataURL(); // PNG is the default
          

        canvas.toBlob(blob => {
          let hash = $('#de').val() + $('#para').val() + Date.now()
          let de = $('#de').val()
          let para = $('#para').val()
          let createdAt = Date.now()
          
          const storageRef = firebase.storage().ref();
          const uploadTask = storageRef.child(`cartao/${btoa(hash)}`).put(blob);          

          uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
            (snapshot: firebase.storage.UploadTaskSnapshot) => {
              // upload in progress
              const snap = snapshot;
              let progress = (snap.bytesTransferred / snap.totalBytes) * 100
              
            },
            (error) => {
              // upload failed
              console.log(error);
            },
            () => {
              // upload success

              if (uploadTask.snapshot.downloadURL) {
                let url = uploadTask.snapshot.downloadURL;
                
                this.hash = hash
                
                $.getJSON( "http://is.gd/create.php?callback=?", {
                    url: url,
                    format: "json"
                }).done( data => {
                  this.shortUrl = data.shorturl;
                  console.log(this.shortUrl)
                  this.whatsAppUrl = `whatsapp://send?text=Rommanel - Mãe Presente ${this.shortUrl}`
                  
                });
                  
                firebase.database().ref(`cartao/${btoa(hash)}`)
                  .set({ de: de, para: para, imageUrl: url,  shareFacebook: false, shareWhatsApp: false, shareCopyLink: false,  createdAt: createdAt })
                  
                  this.titleLoader = 'Prontinho! :)'
                  this.txtLoader = 'Agora você já pode compartilhar o seu cartão.'

                  this.stateShareLinks = 'visivel'

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

  public onBasicUpload(event) {
    for(let file of event.files) {
        this.uploadedFiles.push(file);
    }
  }
  public shareFb() {
    
    let params: UIParams = {
      href: this.shortUrl,
      method: 'share'
    };

    this.fb.ui(params)
      .then((res: UIResponse) => {
        firebase.database().ref(`cartao/${btoa(this.hash)}`)
          .update({ shareFacebook: true })
      })
      .catch((e: any) => {
        $('#btns-func').append('<button class="btn push-left btn-primary" data-toggle="modal" data-target="#trocar-bg" id="trocar-bg-btn">Trocar Imagem</button><button class="btn push-right btn-primary" data-toggle="modal" data-target="#trocar-frase" id="trocar-frase-btn">Trocar frase</button>');
        // $('.bg-loader').css('display', 'none');
      });
  }

  public shareWhatsApp() {
    firebase.database().ref(`cartao/${btoa(this.hash)}`)
      .update({ shareWhatsApp: true})
  }

  openForm() {
    $('.bg-loader .form-inline').toggle('slow');
  }
  copyLink() {
    firebase.database().ref(`cartao/${btoa(this.hash)}`)
      .update({ shareCopyLink: true })
    $('#share-link').focus();
    $('#share-link').select();
    document.execCommand('copy');
  }
}
