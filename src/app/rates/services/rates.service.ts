import { Injectable, ApplicationRef } from '@angular/core';
import { tap, map, filter } from 'rxjs/operators';
import { Observable, from, Subject } from 'rxjs';

import { RatesWSService } from './ratesWS.service';
import { TradingPair } from '../interfaces/tradingPair.interface';
import { bitbayURL, bitfinexURL } from '../constants/markets';
import { bitbayBTCQuery, bitbayETHQuery, bitbayLTCQuery,
         bitfinexBTCQuery, bitfinexETHQuery, bitfinexLTCQuery} from '../constants/queries';

@Injectable({providedIn: 'root'})

export class RatesService {

  constructor(private ratesWSService: RatesWSService, private appRef: ApplicationRef) { }

  public getRates(market: string, query: string): Observable<TradingPair> {

    this.ratesWSService.getRatesWS(market, query);
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
        return this.ratesWSService.ratesBTCSubject$;
      case bitbayETHQuery:
        return this.ratesWSService.ratesETHSubject$;
      case bitbayLTCQuery:
        return this.ratesWSService.ratesLTCSubject$;
    }
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
