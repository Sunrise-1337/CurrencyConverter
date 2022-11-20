import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RateApiService } from './services/rate-api.service';
import { headCurrency } from './interface/headCurrency';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  headerCurrencies: headCurrency[] = [];
  mainCurrency: string = "";

  @ViewChild('firstAmount')
  firstInput!: ElementRef<HTMLInputElement>;
  @ViewChild('secondAmount')
  secondInput!: ElementRef<HTMLInputElement>;

  constructor(private rateApiService: RateApiService){
  }

  ngOnInit(): void {
    this.headerCurrencies = this.rateApiService.getHeaderCurrencies()
  }

  dataProcessing(mode: number, amount: string, currency: string, currency2: string, amount2: string =''){
    if (currency !== currency2) {
      if (+amount > 0){
        this.rateApiService.getCurrency(currency, currency2, +amount).subscribe((res: headCurrency) => {
          if (res.success){
            if (mode === 1) {
              this.secondInput.nativeElement.value = res.result
              this.mainCurrency = `Currency rate: ${res.info.rate} →`;
            } else {
              this.firstInput.nativeElement.value = res.result
              this.mainCurrency = `← Currency rate: ${res.info.rate}`;
            }
          }
        })
      } else if (+amount2 > 0){
        this.rateApiService.getCurrency(currency2, currency, +amount2).subscribe((res: headCurrency) => {
          if (res.success){
            if (mode !== 1) {
              this.secondInput.nativeElement.value = res.result
              this.mainCurrency = `Currency rate: ${res.info.rate} →`;
            } else {
              this.firstInput.nativeElement.value = res.result
              this.mainCurrency = `← Currency rate: ${res.info.rate}`;
            }
          }
        })
      }
    } else {
      this.mainCurrency = `Same currency`;
      if (mode !== 1) {
        this.firstInput.nativeElement.value = ''
      } else {
        this.secondInput.nativeElement.value = ''
      }
    }
  }
}