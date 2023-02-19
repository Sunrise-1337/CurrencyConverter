import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { debounceTime, first, map, Subject, takeUntil } from 'rxjs';
import { RateApiService } from 'src/app/services/rate-api.service';

@Component({
  selector: 'app-currency-converter',
  templateUrl: './currency-converter.component.html',
  styleUrls: ['./currency-converter.component.scss']
})
export class CurrencyConverterComponent implements OnInit, OnDestroy {
  currencyForm!: FormGroup;

  destroy$: Subject<boolean> = new Subject<boolean>()

  constructor(private currencyService: RateApiService) { }

  ngOnInit(): void {
    this.currencyForm = new FormGroup({
      firstCurrencyAmount: new FormControl(),
      firstCurrency: new FormControl('USD'),
      secondCurrencyAmount: new FormControl(),
      secondCurrency: new FormControl('UAH'),
    })

    this.currencyForm.controls['firstCurrencyAmount'].valueChanges.pipe(debounceTime(1000), takeUntil(this.destroy$)).subscribe(newValue => {
      this.convertValue(this.currencyForm.controls['firstCurrency'].value, 
      this.currencyForm.controls['secondCurrency'].value, newValue, this.currencyForm.controls['secondCurrencyAmount'])
    })

    this.currencyForm.controls['secondCurrencyAmount'].valueChanges.pipe(debounceTime(1000), takeUntil(this.destroy$)).subscribe(newValue => {
      this.convertValue(this.currencyForm.controls['secondCurrency'].value, 
      this.currencyForm.controls['firstCurrency'].value, newValue, this.currencyForm.controls['firstCurrencyAmount'])
    })

    this.currencyForm.controls['firstCurrency'].valueChanges.pipe(takeUntil(this.destroy$)).subscribe(newValue => {
      this.convertValue(newValue, this.currencyForm.controls['secondCurrency'].value, 
      this.currencyForm.controls['firstCurrencyAmount'].value, this.currencyForm.controls['secondCurrencyAmount'])
    })

    this.currencyForm.controls['secondCurrency'].valueChanges.pipe(takeUntil(this.destroy$)).subscribe(newValue => {
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
    this.destroy$.next(true)
    this.destroy$.unsubscribe()
  }
}