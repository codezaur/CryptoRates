import { Injectable } from '@angular/core';
import { tap, map, filter } from 'rxjs/operators';

import { RatesWSService } from './ratesWS.service';
import { TradingPair } from '../interfaces/tradingPair.interface';
import { Observable, from } from 'rxjs';

@Injectable({providedIn: 'root'})

export class RatesService {

  constructor(private ratesWSService: RatesWSService) { }

  public getRates(): Observable<TradingPair> {

    this.ratesWSService.getRatesWS();
    return this.ratesWSService
               .ratesSubject$.pipe(
                              filter((val: MessageEvent) => JSON.parse(val.data).action === 'push'),
                              map((msg: MessageEvent) => this.prepareTradingPair(msg)),
                              tap((v) => console.log('---mapped: ', v))
                              );
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
