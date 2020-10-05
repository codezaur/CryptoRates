import { Injectable } from '@angular/core';

import { selectedPairs } from '../../constants/pairs';
import { TradingPair } from '../../interfaces/tradingPair.interface';
import { ExternalTicker } from '../../interfaces/externalTicker.inteface';

@Injectable({providedIn: 'root'})

export class BitbayService {

  constructor() {}

  extractInitalTraidingPairs(ticker: ExternalTicker): TradingPair[] {
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

}

// interface BitbayTicker { items: []; }
