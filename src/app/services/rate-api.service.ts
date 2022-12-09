import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { currencyInterface } from 'src/app/interfaces/currency.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RateApiService {
  url = 'https://api.exchangerate.host/convert';
  baseCurrency = 'UAH';
  currency1 = 'EUR';
  currency2 = 'USD';

  constructor(private http: HttpClient) {
  }

  getCurrency(from: string, to: string, amount: number): Observable<currencyInterface>{
    return this.http.get<currencyInterface>(`${this.url}?from=${from}&to=${to}&amount=${amount}&places=2`)
  }

  getHeaderCurrencies(): currencyInterface[]{
    let array: currencyInterface[] = [];
    this.http
      .get<currencyInterface>(`${this.url}?from=${this.currency1}&to=${this.baseCurrency}&amount=1&places=2`)
      .subscribe(res => array.push(res))
    this.http
      .get<currencyInterface>(`${this.url}?from=${this.currency2}&to=${this.baseCurrency}&amount=1&places=2`)
      .subscribe(res => array.push(res))
    return array
  }
}