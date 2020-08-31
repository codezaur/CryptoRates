import { Component, OnInit, ChangeDetectorRef} from '@angular/core';
import { Observable, of } from 'rxjs';

import { RatesService } from './services/rates.service';
import { TradingPair } from './interfaces/tradingPair.interface';
// import { TradingPair } from './models/tradingPair.model';
import { bitbayURL, bitfinexURL } from './constants/markets';
import { bitbayBTCQuery, bitbayETHQuery, bitbayLTCQuery,
         bitfinexBTCQuery, bitfinexETHQuery, bitfinexLTCQuery} from './constants/queries';

@Component({
  selector: 'app-rates',
  templateUrl: './rates.component.html',
  styleUrls: ['./rates.component.css']
})
export class RatesComponent implements OnInit {

  ratesBTC$: Observable<TradingPair>;
  ratesETH$: Observable<TradingPair>;
  ratesLTC$: Observable<TradingPair>;
  constructor(private CD: ChangeDetectorRef, private ratesService: RatesService) {
    // CD.detach();
    // setInterval(() => { this.CD.detectChanges(); }, 100);
  }

  ngOnInit() {
    this.connect();
  }


  private connect(): void {
    this.ratesBTC$ = this.ratesService.getRates(bitbayURL, bitbayBTCQuery);
    this.ratesETH$ = this.ratesService.getRates(bitbayURL, bitbayETHQuery);
    this.ratesLTC$ = this.ratesService.getRates(bitbayURL, bitbayLTCQuery);
  }

}
