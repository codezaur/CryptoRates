import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap, map, filter, share } from 'rxjs/operators';

import { selectedPairs } from '../../constants/pairs';
import { bitbayBTCQuery, bitbayETHQuery, bitbayLTCQuery } from '../../constants/queries';
import { TradingPair } from '../../interfaces/tradingPair.interface';
import { ExternalTicker } from '../../interfaces/externalTicker.inteface';

@Injectable({providedIn: 'root'})

export class BitbayService {

  constructor() {}

  public extractInitalTraidingPairs(ticker: ExternalTicker): TradingPair[] {
  // extractInitalTraidingPairs<T extends {items: []; }>(ticker: T): TradingPair[] {
    console.log('---ticker in extracting: ', ticker);
    const extractedPairs: TradingPair[] = [];
    Object.keys(ticker.items).forEach((item: string) => {
      console.log('---ticker item: ', item);
      if (selectedPairs.includes(item)) {
        extractedPairs.push({pair: ticker.items[item].market.code,
                             price: ticker.items[item].rate});
      }
    });
    return extractedPairs;
  }

  public assignInitialQuery(currency: string): string {
    switch (currency) {
      case 'BTC':
        return bitbayBTCQuery;
      case 'LTC':
        return bitbayLTCQuery;
      case 'ETH':
        return bitbayETHQuery;
    }
  }

  public handleBitbayWSResponse(response: Observable<MessageEvent>): Observable<TradingPair> {
    return response.pipe(
                    tap((v) => console.log('---BTB SRV: ', v)),
                    filter((val: MessageEvent) => JSON.parse(val.data).action === 'push'),
                    map((val: MessageEvent) => this.prepareTradingPair(val)),
                    tap((v) => console.log('---mapped: ', v)),
                    share()
    );
  }

  private prepareTradingPair(msg: MessageEvent): TradingPair {
    const data = JSON.parse(msg.data);
    console.log('---prepare data: ', data);
    return {
      pair: data.message.changes[0].marketCode,
      price: data.message.changes[0].rate,
    };
  }

}
