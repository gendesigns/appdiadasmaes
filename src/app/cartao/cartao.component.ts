import { Component, OnInit } from '@angular/core';

declare let $: any

@Component({
  selector: 'app-cartao',
  templateUrl: './cartao.component.html',
  styleUrls: ['./cartao.component.css']
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

  public frase;
  public cartao;

  constructor() { }

  ngOnInit() {
    function doOnOrientationChange() {
      if (('ontouchstart' in document.documentElement)) {
        if (screen.height < screen.width) {
          $('.cartao').addClass('landscape');
        } else if (('ontouchstart' in document.documentElement)) {
          $('.cartao').removeClass('landscape');
        }
      }
    }
    window.addEventListener('orientationchange', doOnOrientationChange);
    doOnOrientationChange();

    this.gerarCartao();
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
}
