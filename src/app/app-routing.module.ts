import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { CartaoComponent } from './cartao/cartao.component';
import { MonitoramentoComponent } from './monitoramento/monitoramento.component';

const routes: Routes = [
    { path: '', component: HomeComponent},
    { path: 'cartao', component: CartaoComponent},
    { path: 'monitoramento', component: MonitoramentoComponent }
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forRoot(routes)]
})
export class AppRoutingModule { }