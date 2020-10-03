import { Component, OnInit } from '@angular/core';
import { Observable, of, from } from 'rxjs';

import { RatesService } from './services/rates.service';
import { TradingPair } from './interfaces/tradingPair.interface';
// import { TradingPair } from './models/tradingPair.model';
import { WSbitbayURL, WSbitfinexURL, RESTbitbayURL, RESTbitfinexURL } from './constants/markets';
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

  markets: string[] = ['Bitbay', 'Bitfinex'];

  selectedMarket = 'Bitbay';
  // selectedMarket = 'Bitfinex';

  constructor(private ratesService: RatesService) {
  }

  ngOnInit() {
    this.getInitalRates();
        // .then(() => this.listenForUpdates());

    // this.getInitalRates()
    //     .then(() => this.listenForUpdates());
  }

  public selectMarket(market: string): void {
    this.selectedMarket = market;
    // this.listenForUpdates();
    this.test();
  }

  private test() {
    return this.ratesService.getInitalRates(RESTbitfinexURL)
                     .then((v: any) => {console.log('%c[---v :]', 'color:lime', v)})
                     .catch((e) => console.log('%c[---er :]', 'color:lime', e));
  }

  private getInitalRates(): Promise<any> {

    return this.ratesService.getInitalRates(RESTbitbayURL)
                     .then((initialPairs: TradingPair[]) => {
                           this.allRates = initialPairs;
    });
  }

  private listenForUpdates(): void {

    this.ratesService.getRatesUpdates(this.selectedMarket, this.allRates)
                     .subscribe((pair: TradingPair) =>  {
                        this.allRates.map((item: TradingPair) => {
                          if (item.pair === pair.pair) {
                            item.price = pair.price ;
                          }
                      });
    });
  }

}
