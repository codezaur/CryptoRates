import { Injectable } from '@angular/core';
import { Observable, of, EMPTY } from 'rxjs';
import { tap, map, filter, switchMap } from 'rxjs/operators';

import { selectedPairs } from '../../constants/pairs';
import { bitfinexBTCQuery, bitfinexETHQuery, bitfinexLTCQuery } from '../../constants/queries';
import { TradingPair } from '../../interfaces/tradingPair.interface';

@Injectable({providedIn: 'root'})

export class BitfinexService {

  pairsIDs = {BTCUSD: '', ETHUSD: '', LTCUSD: ''};

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

  public handleBitfinexWSResponse(response: Observable<MessageEvent>): Observable<TradingPair> {
    return response.pipe(
                    filter((val: MessageEvent) => JSON.parse(val.data).event !== 'info'),
                    switchMap((val: MessageEvent) => {
                      if (JSON.parse(val.data).event === 'subscribed') {
                        const pairSymbol: string = (JSON.parse(val.data)).pair;
                        this.pairsIDs[pairSymbol] = (JSON.parse(val.data)).chanId;
                        return EMPTY;
                      } else {
                        return of(val);
                      }
                    }),
                    map((v) => this.prepareTradingPair(v)),
    );
  }

  private prepareTradingPair(msg: MessageEvent): TradingPair {

    const id = (JSON.parse(msg.data))[0];
    const currency = Object.keys(this.pairsIDs)[Object.values(this.pairsIDs).indexOf(id)];
    const price = (JSON.parse(msg.data))[1][0];

    return {pair: currency, price};
  }

  private prepareSelectedPairs(): string[] {
    return selectedPairs.map((pair: string) => pair.replace('-', ''));
  }

}

