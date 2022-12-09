import { Component, OnInit } from '@angular/core';
import { RateApiService } from 'src/app/services/rate-api.service';
import { currencyInterface } from 'src/app/interfaces/currency.interface';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  headerCurrencies: currencyInterface[] = [];

  constructor(private rateApiService: RateApiService){
  }

  ngOnInit(): void {
    this.headerCurrencies = this.rateApiService.getHeaderCurrencies()
  }

}
