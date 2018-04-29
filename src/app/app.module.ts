import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { CartaoComponent } from './cartao/cartao.component';
import { AppRoutingModule } from './/app-routing.module';

import { FacebookModule } from 'ngx-facebook';

import {NgPipesModule} from 'ngx-pipes';
import {NgxPaginationModule} from 'ngx-pagination'; 

import { FileUploadModule } from 'primeng/components/fileupload/fileupload';
import { MonitoramentoComponent } from './monitoramento/monitoramento.component';
import { FirebaseConfig } from '../environments/firebase.config';



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CartaoComponent,
    MonitoramentoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpModule,
    BrowserAnimationsModule,
    FormsModule,
    FileUploadModule,
    FacebookModule.forRoot(),
    AngularFireModule.initializeApp(FirebaseConfig),
    AngularFireDatabaseModule,
    NgPipesModule,
    NgxPaginationModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
