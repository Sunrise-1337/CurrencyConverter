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

  private isFirstToSecond(amount: number, currencyOne: string, currencyTwo: string): boolean {
    return amount !== this.prevFirstAmount || currencyOne !== this.prevFirstCurrency || currencyTwo !== this.prevSecondCurrency
  }

  onSubmit(form: FormGroup) {
    const {firstCurrency, 
          secondCurrency, 
          firstCurrencyAmount, 
          secondCurrencyAmount} = this.currencyForm.value;

    // First option
    this.currencyService
      .getCurrency(firstCurrency, secondCurrency, 1)
      .pipe(
        first(), 
        map(res => res.info.rate)
      )
      .subscribe(res => {
        if (this.isFirstToSecond(firstCurrencyAmount, firstCurrency, secondCurrency)){
          this.prevFirstAmount = firstCurrencyAmount;
          this.prevSecondAmount = secondCurrencyAmount;
          this.prevFirstCurrency = firstCurrency;
          this.prevSecondCurrency = secondCurrency;

          form.controls['secondCurrencyAmount'].setValue((firstCurrencyAmount * res).toFixed(2))
        }

        if (secondCurrencyAmount !== this.prevSecondAmount){
          this.prevFirstAmount = secondCurrencyAmount / res;
          this.prevSecondAmount = secondCurrencyAmount;

          form.controls['firstCurrencyAmount'].setValue(this.prevFirstAmount.toFixed(2))
        }
      })

    // Second option
    // if (this.isFirstToSecond(firstCurrencyAmount, firstCurrency, secondCurrency)) {
    //   this.prevFirstAmount = firstCurrencyAmount;
    //   this.prevSecondAmount = secondCurrencyAmount;
    //   this.prevFirstCurrency = firstCurrency;
    //   this.prevSecondCurrency = secondCurrency;

    //   this.currencyService
    //     .getCurrency(firstCurrency, secondCurrency, firstCurrencyAmount)
    //     .pipe(
    //       first(), 
    //       map(res => +res.result)
    //     ).subscribe(res => {
    //       form.controls['secondCurrencyAmount'].setValue(res.toFixed(2))
    //     })
    // }       


    // if (secondCurrencyAmount !== this.prevSecondAmount){
    //   this.currencyService
    //     .getCurrency(secondCurrency, firstCurrency, secondCurrencyAmount)
    //     .pipe(
    //       first(), 
    //       map(res => +res.result)
    //     ).subscribe(res => {
    //       form.controls['firstCurrencyAmount'].setValue(res.toFixed(2))
    //       this.prevFirstAmount = +res.toFixed(2);
    //       this.prevSecondAmount = secondCurrencyAmount;
    //       form.controls['firstCurrencyAmount'].setValue(this.prevFirstAmount.toFixed(2))
    //     })
    // }
  }

}
