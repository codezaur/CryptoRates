import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';

import { RatesService } from './services/rates.service';
import { TradingPair } from './interfaces/tradingPair.interface';
// import { TradingPair } from './models/tradingPair.model';

@Component({
  selector: 'app-rates',
  templateUrl: './rates.component.html',
  styleUrls: ['./rates.component.css']
})
export class RatesComponent implements OnInit {

  constructor(private ratesService: RatesService) { }

  rates$: Observable<TradingPair>;

  ngOnInit() {
    this.connect();
  }


  private connect() {
    this.rates$ = this.ratesService.getRates();
  }

}
