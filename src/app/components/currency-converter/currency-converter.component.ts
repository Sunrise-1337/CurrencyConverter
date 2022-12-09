import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RateApiService } from 'src/app/services/rate-api.service';
import { currencyInterface } from 'src/app/interfaces/currency.interface';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-currency-converter',
  templateUrl: './currency-converter.component.html',
  styleUrls: ['./currency-converter.component.scss']
})
export class CurrencyConverterComponent implements OnInit{
  notification: string = "";
  mode: number = 0;
  form!: FormGroup;

  @ViewChild('firstAmount')
  firstInput!: ElementRef<HTMLInputElement>;
  @ViewChild('secondAmount')
  secondInput!: ElementRef<HTMLInputElement>;

  constructor(private rateApiService: RateApiService){
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      amount1: new FormControl(),
      amount2: new FormControl(),
      currency1: new FormControl('', Validators.required),
      currency2: new FormControl('', Validators.required)
    })
  }

  onSubmit(currency: string, currency2: string, amount: string, amount2: string =''){
    if (currency !== currency2 && currency && currency2){
      if (this.mode === 1 && +amount > 0) {
        this.rateApiService.getCurrency(currency, currency2, +amount).subscribe((res: currencyInterface) => {
          if (res.success){
            this.secondInput.nativeElement.value = res.result
            this.notification = `Currency rate: ${res.info.rate} →`;
          }
        })
      } else if (this.mode === 2 && +amount2 > 0) {
        this.rateApiService.getCurrency(currency2, currency, +amount2).subscribe((res: currencyInterface) => {
          if (res.success){
            this.firstInput.nativeElement.value = res.result;
            this.notification = `← Currency rate: ${res.info.rate}`;
          }
        })
      } else {
        this.notification = `There is no value to convert`;  
      }
    } else if (currency && currency2){
      this.notification = `Same currency`;
    } else {
      this.notification = 'The currency is not defined'
    }
  }
}

