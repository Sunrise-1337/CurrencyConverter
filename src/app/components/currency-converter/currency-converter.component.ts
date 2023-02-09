import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { first, map } from 'rxjs';
import { RateApiService } from 'src/app/services/rate-api.service';

@Component({
  selector: 'app-currency-converter',
  templateUrl: './currency-converter.component.html',
  styleUrls: ['./currency-converter.component.scss']
})
export class CurrencyConverterComponent implements OnInit {
  currencyForm!: FormGroup;

  prevFirstAmount!: number;
  prevSecondAmount!: number;
  prevFirstCurrency: string = 'USD';
  prevSecondCurrency: string = 'UAH';

  constructor(private currencyService: RateApiService) { }

  ngOnInit(): void {
    this.currencyForm = new FormGroup({
      firstCurrencyAmount: new FormControl(),
      firstCurrency: new FormControl(this.prevFirstCurrency),
      secondCurrencyAmount: new FormControl(),
      secondCurrency: new FormControl(this.prevSecondCurrency),
    })
  }

  onSubmit(form: FormGroup) {
    let currency1 = form.controls['firstCurrency'].value,
        currency2 = form.controls['secondCurrency'].value,
        amount1 = form.controls['firstCurrencyAmount'].value,
        amount2 = form.controls['secondCurrencyAmount'].value;

    this.currencyService
      .getCurrency(currency1, currency2, 1)
      .pipe(
        first(), 
        map(res => res.info.rate)
      )
      .subscribe(res => {
        if (amount1 !== this.prevFirstAmount 
            || currency1 !== this.prevFirstCurrency 
            || currency2 !== this.prevSecondCurrency)
          {
          this.prevFirstAmount = amount1;
          this.prevSecondAmount = amount2;
          this.prevFirstCurrency = currency1;
          this.prevSecondCurrency = currency2;

          form.controls['secondCurrencyAmount'].setValue((amount1 * res).toFixed(2))
        }

        if (amount2 !== this.prevSecondAmount){
          this.prevFirstAmount = amount2 / res;
          this.prevSecondAmount = amount2;

          form.controls['firstCurrencyAmount'].setValue(this.prevFirstAmount.toFixed(2))
        }
      })
  }

}
