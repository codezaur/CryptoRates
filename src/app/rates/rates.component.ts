import { Component, OnInit, ChangeDetectorRef} from '@angular/core';
import { Observable, of, from } from 'rxjs';

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

  allRates: TradingPair[];

  rates$: Observable<TradingPair> | TradingPair;

  selectedCurrencies: string[] = [];

  constructor(private CD: ChangeDetectorRef, private ratesService: RatesService) {
  }

  ngOnInit() {
    this.getInitalRates()
        .then(() => this.listenForUpdates());
  }

  private getInitalRates(): Promise<any> {

    return this.ratesService.getInitalRates(RESTbitbayURL)
                     .then((initialPairs: TradingPair[]) => {
                           this.allRates = initialPairs;
    });
  }

  private listenForUpdates(): void {

    this.ratesService.getRatesUpdates(WSbitbayURL, this.allRates)
                     .subscribe((pair: TradingPair) =>  {
                        this.allRates.map((item: TradingPair) => {
                          if (item.pair === pair.pair) {
                            item.price = pair.price ;
                          }
                      });
    });
  }

}
