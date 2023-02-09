import { Component, OnInit } from '@angular/core';
import { RateApiService } from 'src/app/services/rate-api.service';
import { currencyInterface } from 'src/app/interfaces/currency.interface';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  euroToUAH$!: Observable<currencyInterface>;
  dollarToUAH$!: Observable<currencyInterface>;

  constructor(private rateApiService: RateApiService){
  }

  ngOnInit(): void {
    this.euroToUAH$ = this.rateApiService.getCurrency('EUR', 'UAH', 1)
    this.dollarToUAH$ = this.rateApiService.getCurrency('USD', 'UAH', 1)
  }

}
