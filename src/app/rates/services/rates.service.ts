import { Injectable } from '@angular/core';
import { tap, map, filter, share } from 'rxjs/operators';
import { Observable, from, Subject } from 'rxjs';

import { TradingPair } from '../interfaces/tradingPair.interface';
import { ExternalTicker } from '../interfaces/externalTicker.inteface';

import { WSbitbayURL, WSbitfinexURL, RESTbitbayURL, RESTbitfinexURL } from '../constants/markets';
import { bitbayBTCQuery, bitbayETHQuery, bitbayLTCQuery,
         bitfinexBTCQuery, bitfinexETHQuery, bitfinexLTCQuery} from '../constants/queries';
import { selectedPairs } from '../constants/pairs';

import { RatesAPIService } from './ratesAPI.service';
import { BitbayService } from './markets/bitbay.service';
import { BitfinexService } from './markets/bitfinex.service';


@Injectable({providedIn: 'root'})

export class RatesService {

  constructor(private ratesAPIService: RatesAPIService,
              private bitbayService: BitbayService,
              private bitfinexService: BitfinexService) { }


  // public getInitalRates(market: string): Promise<TradingPair[]> {

  //   return this.ratesAPIService
  //              .getRatesREST(market)
  //              .then((rates: object|any) => this.extractInitalTraidingPairs(rates));

  // }
  public getInitalRates(market: string): Promise<TradingPair[]> {


    return this.ratesAPIService
               .getRatesREST(market)
               .then(<T>(rates: T) => this.extractInitalTraidingPairs(rates, market));

  }

  public getRatesUpdates(market: string, pairs: TradingPair[]): Observable<TradingPair> {

    const selectedMarket: string = this.assignMarketURL(market);
    pairs.map((pair: TradingPair) => {
      this.ratesAPIService.getRatesWS(selectedMarket,
                                      this.assignInitialQuery(pair, market));
    });
    return this.ratesAPIService.ratesSubject$
                               .pipe(
                                  filter((val: MessageEvent) => JSON.parse(val.data).action === 'push'),
                                  map((msg: MessageEvent) => this.prepareTradingPair(msg)),
                                  tap((v) => console.log('---mapped: ', v)),
                                  share()
                                );
  }

  private assignInitialQuery(pair: TradingPair, market: string): string {

    const currency: string = pair.pair.substring(0, 3);

    switch (market) {
      case 'Bitbay':
        return this.bitbayService.assignInitialQuery(currency);
      case 'Bitfinex':
        return this.bitfinexService.assignInitialQuery(currency);
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

  // private selectSourceSubject(query: string) {

  //   switch (query) {
  //     case bitbayBTCQuery:
  //       return this.ratesAPIService.ratesBTCSubject$;
  //     case bitbayETHQuery:
  //       return this.ratesAPIService.ratesETHSubject$;
  //     case bitbayLTCQuery:
  //       return this.ratesAPIService.ratesLTCSubject$;
  //   }
  // }

  // private extractInitalTraidingPairs(ticker: ExternalTicker, market: string): TradingPair[] {
  private extractInitalTraidingPairs(ticker: any, market: string): TradingPair[] {

    switch (market) {
      case RESTbitbayURL:
        return this.bitbayService.extractInitalTraidingPairs(ticker);
      case RESTbitfinexURL:
        return this.bitfinexService.extractInitalTraidingPairs(ticker);
    }

  }

  private prepareTradingPair(msg: MessageEvent): TradingPair {

    const data = JSON.parse(msg.data);
    return {
      pair: data.message.changes[0].marketCode,
      price: data.message.changes[0].rate,
    };
  }
}
