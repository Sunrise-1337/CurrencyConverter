import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { debounceTime, first, map, Subscription } from 'rxjs';
import { RateApiService } from 'src/app/services/rate-api.service';

@Component({
  selector: 'app-currency-converter',
  templateUrl: './currency-converter.component.html',
  styleUrls: ['./currency-converter.component.scss']
})
export class CurrencyConverterComponent implements OnInit, OnDestroy {
  currencyForm!: FormGroup;

  firstCurrencySub!: Subscription;
  firstCurrencyAmountSub!: Subscription;
  secondCurrencySub!: Subscription;
  secondCurrencyAmountSub!: Subscription;

  constructor(private currencyService: RateApiService) { }

  ngOnInit(): void {
    this.currencyForm = new FormGroup({
      firstCurrencyAmount: new FormControl(),
      firstCurrency: new FormControl('USD'),
      secondCurrencyAmount: new FormControl(),
      secondCurrency: new FormControl('UAH'),
    })

    this.firstCurrencyAmountSub = this.currencyForm.controls['firstCurrencyAmount'].valueChanges.pipe(debounceTime(350)).subscribe(newValue => {
      this.convertValue(this.currencyForm.controls['firstCurrency'].value, 
      this.currencyForm.controls['secondCurrency'].value, newValue, this.currencyForm.controls['secondCurrencyAmount'])
    })

    this.secondCurrencyAmountSub = this.currencyForm.controls['secondCurrencyAmount'].valueChanges.pipe(debounceTime(350)).subscribe(newValue => {
      this.convertValue(this.currencyForm.controls['secondCurrency'].value, 
      this.currencyForm.controls['firstCurrency'].value, newValue, this.currencyForm.controls['firstCurrencyAmount'])
    })

    this.firstCurrencySub = this.currencyForm.controls['firstCurrency'].valueChanges.subscribe(newValue => {
      this.convertValue(newValue, this.currencyForm.controls['secondCurrency'].value, 
      this.currencyForm.controls['firstCurrencyAmount'].value, this.currencyForm.controls['secondCurrencyAmount'])
    })

    this.secondCurrencySub = this.currencyForm.controls['secondCurrency'].valueChanges.subscribe(newValue => {
      this.convertValue(this.currencyForm.controls['firstCurrency'].value, newValue,
      this.currencyForm.controls['firstCurrencyAmount'].value, this.currencyForm.controls['secondCurrencyAmount'])
    })
  }

  convertValue(firstCurrency: string, secondCurrency: string, amount: number, controlToChange: AbstractControl) {
    this.currencyService
    .getCurrency(firstCurrency, secondCurrency, amount)
    .pipe(
      first(), 
      map(res => res.result)
    ).subscribe(res => controlToChange.setValue(res, {emitEvent: false}))
  }

  ngOnDestroy(): void {
    this.firstCurrencySub.unsubscribe()
    this.firstCurrencyAmountSub.unsubscribe()
    this.secondCurrencySub.unsubscribe()
    this.secondCurrencyAmountSub.unsubscribe()
  }
}