import { Injectable, ApplicationRef } from '@angular/core';
import { tap, map, filter } from 'rxjs/operators';
import { Observable, from, Subject } from 'rxjs';

import { RatesAPIService } from './ratesAPIservice';
import { TradingPair } from '../interfaces/tradingPair.interface';
import { bitbayBTCQuery, bitbayETHQuery, bitbayLTCQuery,
         bitfinexBTCQuery, bitfinexETHQuery, bitfinexLTCQuery} from '../constants/queries';
import { UseExistingWebDriver } from 'protractor/built/driverProviders';

@Injectable({providedIn: 'root'})

export class RatesService {

  constructor(private ratesAPIService: RatesAPIService, private appRef: ApplicationRef) { }

  public getInitalRates(market: string): Promise<TradingPair[]> {
    // const allRates: Promise<any> = this.ratesWSService.getRatesREST(market);
    // const extractedRates =  this.extractInitalTraidingPairs(allRates);
    // return extractedRates;

    // let extracted: TradingPair[];

    return this.ratesAPIService
               .getRatesREST(market)
               .then((rates: object|any) => this.extractInitalTraidingPairs(rates));

    // return this.ratesAPIService
    //            .getRatesREST(market)
    //            .then((rates: object|any) => {
    //             extracted  = this.extractInitalTraidingPairs(rates);
    //             console.log('\x1b[36m--ticker in rates SRV: ', extracted);
    //             // return new Promise(() => extracted);

    //             return extracted;
    //            });
              //  new Promise((rates: object|any) => this.extractInitalTraidingPairs(rates))
    // );
  }

  public getRatesUpdates(market: string, query: string): Observable<TradingPair> {

    this.ratesAPIService.getRatesWS(market, query);
    return this.selectSourceSubject(query)
                .pipe(
                   tap((v) => console.log('--val in rates SRV: ', v)),
                   filter((val: MessageEvent) => JSON.parse(val.data).action === 'push'),
                   map((msg: MessageEvent) => this.prepareTradingPair(msg)),
                   tap((v) => console.log('---mapped: ', v)),
                   tap((v) => this.appRef.tick()),
                   );
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
    extractedPairs[0] = {pair: ticker.items["BTC-USD"].market.code,
                         price: ticker.items["BTC-USD"].rate };
    extractedPairs[1] = {pair: ticker.items["ETH-USD"].market.code,
                         price: ticker.items["ETH-USD"].rate };
    extractedPairs[2] = {pair: ticker.items["LTC-USD"].market.code,
                         price: ticker.items["LTC-USD"].rate };
    return extractedPairs;
  }

  private prepareTradingPair(msg: MessageEvent): TradingPair {
    const data = JSON.parse(msg.data);
    return {
      pair: data.message.changes[0].marketCode,
      price: data.message.changes[0].rate,
      entryType: data.message.changes[0].entryType,
    };
  }
}
