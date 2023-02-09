import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { currencyInterface } from 'src/app/interfaces/currency.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RateApiService {
  url = 'https://api.exchangerate.host/convert';

  constructor(private http: HttpClient) {
  }

  getCurrency(from: string, to: string, amount: number): Observable<currencyInterface>{
    return this.http.get<currencyInterface>(`${this.url}?from=${from}&to=${to}&amount=${amount}&places=2`)
  }
}