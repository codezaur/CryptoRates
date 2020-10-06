import { Injectable } from '@angular/core';

import { selectedPairs } from '../../constants/pairs';
import { bitfinexBTCQuery, bitfinexETHQuery, bitfinexLTCQuery } from '../../constants/queries';
import { TradingPair } from '../../interfaces/tradingPair.interface';
import { ExternalTicker } from '../../interfaces/externalTicker.inteface';

@Injectable({providedIn: 'root'})

export class BitfinexService {

  constructor() {}

  public extractInitalTraidingPairs(ticker: any[]): TradingPair[] {
    const extractedPairs: TradingPair[] = [];
    const preparedPairs: string[] = this.prepareSelectedPairs();

    ticker.forEach((item: any[]) => {
      if (this.prepareSelectedPairs().includes(item[0].substring(1))) {
      extractedPairs.push({pair: item[0].substring(1).slice(0, 3) + '-' + item[0].substring(1).slice(3),
                           price: item[1] });
      }
    });

    return extractedPairs;
  }

  public assignInitialQuery(currency: string): string {
    switch (currency) {
      case 'BTC':
        return bitfinexBTCQuery;
      case 'LTC':
        return bitfinexLTCQuery;
      case 'ETH':
        return bitfinexETHQuery;
    }
  }

  private prepareSelectedPairs(): string[] {
    return selectedPairs.map((pair: string) => pair.replace('-', ''));
  }

}
