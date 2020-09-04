import { Component, OnInit, ChangeDetectorRef} from '@angular/core';
import { Observable, of } from 'rxjs';

import { RatesService } from './services/rates.service';
import { TradingPair } from './interfaces/tradingPair.interface';
// import { TradingPair } from './models/tradingPair.model';
import { WSbitbayURL, WSbitfinexURL, RESTbitbayURL } from './constants/markets';
import { bitbayBTCQuery, bitbayETHQuery, bitbayLTCQuery,
         bitfinexBTCQuery, bitfinexETHQuery, bitfinexLTCQuery} from './constants/queries';

@Component({
  selector: 'app-rates',
  templateUrl: './rates.component.html',
  styleUrls: ['./rates.component.css']
})
export class RatesComponent implements OnInit {

  ratesBTC$: Observable<TradingPair> | TradingPair;
  ratesETH$: Observable<TradingPair> | TradingPair;
  ratesLTC$: Observable<TradingPair> | TradingPair;
  constructor(private CD: ChangeDetectorRef, private ratesService: RatesService) {
    // CD.detach();
    // setInterval(() => { this.CD.detectChanges(); }, 100);
  }

  ngOnInit() {
    this.getInitalRates();
    // this.listenForUpdates();
  }

  private getInitalRates() {
    // const initialPairs: Promise<TradingPair[]> = this.ratesService.getInitalRates(RESTbitbayURL);
    // console.log('\x1b[36m--init: ', initialPairs);
    // this.ratesBTC$ = initialPairs[0];
    // this.ratesETH$ = initialPairs[1];
    // this.ratesLTC$ = initialPairs[2];

    this.ratesService.getInitalRates(RESTbitbayURL)
                     .then((initialPairs: TradingPair[]) => {
                           this.ratesBTC$ = initialPairs[0];
                           this.ratesETH$ = initialPairs[1];
                           this.ratesLTC$ = initialPairs[2];
                           console.log('\x1b[36m--btc IN C: ', this.ratesBTC$);
    });
  }

  private listenForUpdates(): void {
    this.ratesBTC$ = this.ratesService.getRatesUpdates(WSbitbayURL, bitbayBTCQuery);
    this.ratesETH$ = this.ratesService.getRatesUpdates(WSbitbayURL, bitbayETHQuery);
    this.ratesLTC$ = this.ratesService.getRatesUpdates(WSbitbayURL, bitbayLTCQuery);
  }

}
