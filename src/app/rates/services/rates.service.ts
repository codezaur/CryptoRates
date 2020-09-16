import { Injectable, ApplicationRef } from '@angular/core';
import { tap, map, filter, share } from 'rxjs/operators';
import { Observable, from, Subject } from 'rxjs';

import { RatesAPIService } from './ratesAPI.service';
import { TradingPair } from '../interfaces/tradingPair.interface';
import { WSbitbayURL, WSbitfinexURL, RESTbitbayURL } from '../constants/markets';
import { bitbayBTCQuery, bitbayETHQuery, bitbayLTCQuery,
         bitfinexBTCQuery, bitfinexETHQuery, bitfinexLTCQuery} from '../constants/queries';
import { selectedPairs } from '../constants/pairs';

@Injectable({providedIn: 'root'})

export class RatesService {

  constructor(private ratesAPIService: RatesAPIService, private appRef: ApplicationRef) { }

  public getInitalRates(market: string): Promise<TradingPair[]> {

    return this.ratesAPIService
               .getRatesREST(market)
               .then((rates: object|any) => this.extractInitalTraidingPairs(rates));

  }

  public getRatesUpdates(market: string, pairs: TradingPair[]): Observable<TradingPair> {

    pairs.map((pair: TradingPair) => {
      this.ratesAPIService.getRatesWS(this.assignMarketURL(market),
                                      this.assignInitialQuery(pair));
      // const query = this.assignInitialQuery(pair);
      // this.ratesAPIService.getRatesWS(market, query);
    });
    return this.ratesAPIService.ratesSubject$
                               .pipe(
                                  filter((val: MessageEvent) => JSON.parse(val.data).action === 'push'),
                                  map((msg: MessageEvent) => this.prepareTradingPair(msg)),
                                  tap((v) => console.log('---mapped: ', v)),
                                  share()
                                );
  }

  private assignInitialQuery(pair: TradingPair): string {

    const currency = pair.pair.substring(0, 3);
    switch (currency) {
      case 'BTC':
        return bitbayBTCQuery;
      case 'LTC':
        return bitbayLTCQuery;
      case 'ETH':
        return bitbayETHQuery;
    }

  }

  private assignMarketURL(market: string): string {
    switch (market) {
      case 'Bitbay':
        return WSbitbayURL;
      case 'Bitfinex':
        return WSbitfinexURL;
    }
  }

  private selectSourceSubject(query: string) {

    switch (query) {
      case bitbayBTCQuery:
        return this.ratesAPIService.ratesBTCSubject$;
      case bitbayETHQuery:
        return this.ratesAPIService.ratesETHSubject$;
      case bitbayLTCQuery:
        return this.ratesAPIService.ratesLTCSubject$;
    }
  }

  private extractInitalTraidingPairs(ticker: object | any): TradingPair[] {
    console.log('---ticker in extracting: ', ticker);
    const extractedPairs: TradingPair[] = [];
    Object.keys(ticker.items).forEach((item: string) => {
      if (selectedPairs.includes(item)) {
        extractedPairs.push({pair: ticker.items[item].market.code,
                             price: ticker.items[item].rate});
      }
    });
    return extractedPairs;
  }

  private prepareTradingPair(msg: MessageEvent): TradingPair {

    const data = JSON.parse(msg.data);
    return {
      pair: data.message.changes[0].marketCode,
      price: data.message.changes[0].rate,
    };
  }
}
