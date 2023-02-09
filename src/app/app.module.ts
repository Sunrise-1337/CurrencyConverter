import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { RateApiService } from './services/rate-api.service';
import { ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './components/pages/home/home.component';
import { CurrencyConverterComponent } from './components/currency-converter/currency-converter.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    CurrencyConverterComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
  ],
  providers: [RateApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
